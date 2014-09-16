/** @jsx React.DOM */
/*
*
*   Main Nav Container
*
* */
var IAMainNavContainer = (IAMainNavContainer = React).createClass({


  render: function() {

    var scope = this.props.scope;
    var singleClickItem = function(event) {
      if (event.target.attributes['data-id']){
        scope.$apply(function () {
          scope.navTreeItemClicked('root', event.target.attributes['data-id'].value, event.metaKey);
        });
      }
    };
    var projectName = scope.projectName || '(unknown project)';
    return (
      <div>
        <div className="ia-project-title-header-container" >
          <div className="ia-project-nav-help">
            <a target="_blank" href="http://docs.strongloop.com/display/SLS/Using+StrongLoop+Studio">
              <span id="mainNavContextHelp" data-id="MainNavContextHelp" className="sl-icon sl-icon-question-mark"></span>
            </a>
          </div>
          <span className="ia-project-title-container">{projectName}</span>
        </div>
        <IAMainModelNav scope={this.props.scope} />
        <IAMainDatasourceNav scope={this.props.scope} />
      </div>
      );
  }
});
/*
*
*   Model Main Nav
*
* */
var IAMainModelNav = (IAMainModelNav = React).createClass({
  getInitialState: function() {
    return {isModelNavContainerOpen:true};
  },
  openSelectedModels:function(key, opt) {
    var component = this;
    if (opt.sourceEvent.currentTarget.attributes['data-id']) {
      var modelid = opt.sourceEvent.currentTarget.attributes['data-id'].value;
      component.props.scope.$apply(function () {
        component.props.scope.openSelectedInstance(modelid, CONST.MODEL_TYPE);
      });
    }
  },
  deleteSelectedModel: function(key, opt) {
    var scope = this.props.scope;
    try{
      var targetAttributes = opt.sourceEvent.currentTarget.attributes;
      if (targetAttributes['data-id']) {
        var definitionId = targetAttributes['data-id'].value;
        var configId = targetAttributes['data-config-id'] && targetAttributes['data-config-id'].value;
        var instanceId = {
          definitionId: definitionId,
          configId: configId
        };

        scope.$apply(function(){
          scope.deleteInstanceRequest(instanceId, CONST.MODEL_TYPE);
        });
      } else {
        console.warn('Missing some of the required model attributes.');
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }
  },
  addNewInstanceRequest: function(event) {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.createModelViewRequest();
    });
  },
  componentDidMount: function() {
    var component = this;
    var menuItems = {};
    var currentDSName = null;
    var isDiscoverable = false;

//    menuItems.openSelectedModels = {name: "open", callback: component.openSelectedModels};
    menuItems.deleteSelectedModel = {name: "delete", callback: component.deleteSelectedModel};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.btn-nav-context',
      trigger: 'left',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          if (opt.sourceEvent.target.attributes['data-name']){
            currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
          }
        }
      }
    });
  },
  toggleModelNav: function() {
    $('.model-branch-container').toggle(250);
    var currState = this.state.isModelNavContainerOpen;
    this.setState({isModelNavContainerOpen:!currState});
  },
  render: function() {

    var component = this;
    var scope = component.props.scope;

    var modelSelectedCollection = [];
    var cx = React.addons.classSet;


    var clickBranch = function(event) {
      scope.$apply(function () {
        scope.navTreeBranchClicked('model');
      });
    };

    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('model', val, event.metaKey);
        });
      }
    };
    var navModels = [];
    if (Array.isArray(scope.mainNavModels)) {
      navModels = scope.mainNavModels;
    }
    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list model-branch-container is-open': scope.modelNavIsVisible,
      'ia-tree-node-table branch-leaf-list model-branch-container is-closed': !scope.modelNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': component.state.isModelNavContainerOpen,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !component.state.isModelNavContainerOpen
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'nav-branch-folder-icon sl-icon sl-icon-folder': scope.modelNavIsVisible,
      'nav-branch-folder-icon sl-icon sl-icon-folder': !scope.modelNavIsVisible
    });
    var rowItems = navModels.map(function(item) {
      var classNameVar = 'tree-item-row ';
      if (item.isActive) {
        classNameVar += ' is-active';
      }
      else if (item.isOpen) {
        classNameVar += ' is-open';
      }
      else if (item.isSelected) {
        classNameVar += ' is-selected'
      }
      var dsConnectEl = (<span />);
      if (item.dataSource && (item.dataSource !== CONST.DEFAULT_DATASOURCE )) {
        dsConnectEl = (<span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-lightning"></span>);
      }
      item.configId = item.config && item.config.id;

      return (
        <div data-ui-type="row" className={classNameVar} data-id={item.id}>
          <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
            <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-file"></span>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-name-container-col">
            <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
            </button>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            {dsConnectEl}
          </div>
          <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
            <button className="btn-command btn-nav-context" data-id={item.id} data-config-id={item.configId}>
              <span data-name={item.name} data-id={item.id} data-config-id={item.configId} className="sl-icon sl-icon-box-arrow-down"></span>
            </button>
          </div>
        </div>
        );
    });
    return (
      <div>
        <button onClick={component.toggleModelNav} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" >
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon sl-icon sl-icon-folder"></span>
          <span className="nav-branch-title">Models</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={component.addNewInstanceRequest} data-type="model" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Model</button>
      </div>
      );
  }
});
/*
*
*   Datasource Main Nav
*
* */
var IAMainDatasourceNav = (IAMainDatasourceNav = React).createClass({
  getInitialState: function() {
    return {isDataSourceNavContainerOpen:true};
  },
  openSelectedDataSource:function(key, opt) {
    var component = this;
    if (opt.sourceEvent.currentTarget.attributes['data-id']) {
      var dsId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
      component.props.scope.$apply(function () {
        component.props.scope.openSelectedInstance(dsId, CONST.DATASOURCE_TYPE);
      });
    }
  },
  addNewInstanceRequest: function(event) {
    var scope = this.props.scope;
    if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
      var val = '';
      if (event.target.attributes['data-type']) {
        val = event.target.attributes['data-type'].value;
      }
      else {
        val = event.target.parentElement.attributes['data-type'].value;
      }
      scope.$apply(function() {
        scope.createDatasourceViewRequest();
      });
    }
  },
  deleteSelectedDataSource: function(key, opt) {
    var scope = this.props.scope;

    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var dsIdConfig = {
          definitionId: opt.sourceEvent.currentTarget.attributes['data-id'].value
        };
        scope.$apply(function(){
          scope.deleteInstanceRequest(dsIdConfig, CONST.DATASOURCE_TYPE);
        });
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){
    var menuItems = {};
    var component = this;
    var currentDSName = null;
    var isDiscoverable = false;

   // menuItems.openSelectedDataSource = {name: "open", callback: component.openSelectedDataSource};
    menuItems.deleteSelectedDataSource = {name: "delete", callback: component.deleteSelectedDataSource};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.btn-ds-nav-context',
      trigger: 'left',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          if (opt.sourceEvent.target.attributes['data-name']){
            currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
          }
        }
      }
    });
  },
  toggleDataSourceNav: function() {
    $('.datasource-branch-container').toggle(250);
    var currState = this.state.isDataSourceNavContainerOpen;
    this.setState({isDataSourceNavContainerOpen:!currState});
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;

    var cx = React.addons.classSet;

    var clickBranch = function(event) {
      scope.$apply(function () {
        scope.navTreeBranchClicked('datasource');
      });
    };
    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('datasource', val, event.metaKey);
        });

      }

    };
    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list datasource-branch-container is-open': scope.dsNavIsVisible,
      'ia-tree-node-table branch-leaf-list datasource-branch-container is-closed': !scope.dsNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': component.state.isDataSourceNavContainerOpen,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !component.state.isDataSourceNavContainerOpen
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'sl-icon sl-icon-folder-open': scope.dsNavIsVisible,
      'sl-icon sl-icon-folder-closed': !scope.dsNavIsVisible
    });


    var rowItems = (<div />);
    if (scope.mainNavDatasources.map) {
      rowItems = scope.mainNavDatasources.map(function(item) {
        var classNameVar = 'tree-item-row ';
        if (item.isActive) {
          classNameVar += ' is-active';
        }
        else if (item.isOpen) {
          classNameVar += ' is-open';
        }
        else if (item.isSelected) {
          classNameVar += ' is-selected'
        }
        return (
          <div data-ui-type="row" className={classNameVar} data-id={item.id} >
            <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
              <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-file"></span>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-name-container-col">
              <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
              </button>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            </div>
            <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
              <button className="btn-command btn-ds-nav-context" data-id={item.id}>
                <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-box-arrow-down"></span>
              </button>
            </div>

          </div>
          );
      });
    }

    // Main return
    return (
      <div>
        <button onClick={component.toggleDataSourceNav} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" title="Datasources">
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon sl-icon sl-icon-folder"></span>
          <span className="nav-branch-title">DataSources</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={component.addNewInstanceRequest} data-type="datasource" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Datasource</button>
      </div>
      );
  }
});
/*
*
* Main Controls
*
* */
var IAMainControls = (IAMainControls = React).createClass({
  getInitialState: function() {
    return {
      showNewModel: false,
      newModelText: 'new model'
    };
  },
  componentDidMount: function() {
    window.setUI();
  },
  render: function() {
    var that = this;
    var scope = that.props.scope;

    var createModelViewRequest = function() {

      scope.$apply(function() {
        scope.createModelViewRequest();
      });

    };
    var addNewInstanceRequest = function(event) {
      if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
        var val = '';
        if (event.target.attributes['data-type']) {
          val = event.target.attributes['data-type'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-type'].value;
        }

        var connector = event.target.attributes['data-name'] ?
          event.target.attributes['data-name'].value :
          event.target.parentElement.attributes['data-name'].value;

        scope.$apply(function() {
          scope.createDatasourceViewRequest({
            connector: connector
          });
        });
      }
    };

    var renderAppViewRequest = function() {
      window.open(
        '/#demo',
        '_blank'
      );

    };
    var showExplorerViewRequest = function() {
      scope.$apply(function() {
        scope.showExplorerViewRequest();
      });
    };
    return (
      <div data-id="IAMainControlsContainer">
        <div className="main-controls-title">Create</div>


        <div className="main-controls-container">

        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label className="main-control-command-label">MODEL</label>
              <button onClick={createModelViewRequest} type="button" className="btn btn-sm btn-primary">
                <span className="maincontrol-main-icon sl-icon sl-icon-plus-sign"></span>
                <span className="maincontrol-main-button-label">New</span>
              </button>
            </div>
            <div data-ui-type="cell" className="main-control-apprender-container">
              <label className="main-control-command-label">APP</label>
              <button disabled="disabled" onClick={renderAppViewRequest} type="button" className="btn btn-primary btn-sm">
                <span className="maincontrol-main-icon sl-icon sl-icon-play"></span>
                <span className="maincontrol-main-button-label">Render</span>
              </button>
            </div>
          </div>
        </div>


        <label className="main-control-command-label">DATASOURCE</label>
        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                data-name="oracle"
                className="btn btn-default btn-control-ds"
                title="oracle connector">
                  <span className="sl-icon sl-icon-database"></span>
              </button>
              <div className="ds-type-name">Oracle</div>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds"
                data-type="datasource"
                data-name="mssql"
                onClick={addNewInstanceRequest}
                title="mssql connector">
                  <span className="sl-icon sl-icon-database"></span>
              </button>
              <div className="ds-type-name">MS SQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mysql"
                title="mysql connector">
                  <span className="sl-icon sl-icon-database"></span>
              </button>
              <div className="ds-type-name">MySQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="postgresql"
                title="postgres connector">
                <span className="sl-icon sl-icon-database"></span>
              </button>
              <div className="ds-type-name">PostgreSQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mongodb"
                title="mongodb connector">
                  <span className="sl-icon sl-icon-database"></span>
              </button>
              <div className="ds-type-name">MongoDB</div>
            </div>
          </div>
        </div>

        </div>

      </div>
      );
  }
});
/*
*
* Exception display
*
* */
var IAGlobalExceptionDisplayView = (IAGlobalExceptionDisplayView = React).createClass({
  toggleStackView: function() {
    $('[data-id="GlobalExceptionDetailsContainer"]').toggle(250);
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;
    var displayMarkup = (<div />);
    var clearGlobalException = function() {
      scope.$apply(function() {
        scope.clearGlobalException();
      });
    };

    if (scope.globalExceptionStack.length) {
      var prevMessage = '';
      displayMarkup = scope.globalExceptionStack.map(function(stackItem) {
        if (stackItem.message !== prevMessage) {
          prevMessage = stackItem.message;
          return (
            <div data-id="IAGlobalExceptionDisplayContainer" className="ia-global-exception-container">
              <span onClick={clearGlobalException} className="sl-icon sl-icon-close ia-global-exception-close-button"></span>
              <div className="ia-global-exception-header">Oops! Something is wrong</div>
              <div className="ia-global-exception-link" onClick={component.toggleStackView}>Show/hide details</div>
              <span className="ia-global-exception-value">{stackItem.message}</span>
              <div data-id="GlobalExceptionDetailsContainer">

                <ul className="ia-global-exception-body">
                  <li>
                    <span className="ia-global-exception-label">Name: </span><span className="ia-global-exception-value">{stackItem.name}</span>
                  </li>
                  <li>
                    <span  className="ia-global-exception-label">Message: </span><span className="ia-global-exception-value">{stackItem.message}</span>
                  </li>
                  <li>
                    <span  className="ia-global-exception-label">Details: </span><span className="ia-global-exception-value">{stackItem.details}</span>
                  </li>
                  <li>
                    <span  className="ia-global-exception-label">Request: </span><span className="ia-global-exception-value">{stackItem.requestUrl}</span>
                  </li>
                  <li>
                    <span  className="ia-global-exception-label">Status: </span><span className="ia-global-exception-value">{stackItem.status}</span>
                  </li>

                </ul>
                <div data-id="StackTraceMessageContainer" className="global-exception-stack-display">{stackItem.stack}</div>
              </div>

            </div>);
        }

      });
    }
    return (<div>{displayMarkup}</div>);
  }
});
