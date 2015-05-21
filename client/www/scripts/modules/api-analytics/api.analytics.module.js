var ApiAnalytics = angular.module('ApiAnalytics', []);
var API_METRICS_CONST = {
  CPU_TOTAL: 'cpu.total',
  CPU_SYSTEM: 'cpu.system',
  CPU_USER: 'cpu.user',
  HEAP_TOTAL:'heap.total',
  HEAP_USED:'heap.used',
  LOOP_AVG:'loop.average',
  LOOP_MAX:'loop.maximum',
  LOOP_MIN:'loop.minimum',
  LOOP_COUNT:'loop.count',
  HTTP_AVG:'http.average',
  HTTP_MAX:'http.maximum',
  HTTP_MIN:'http.minimum',
  HTTP_COUNT:'http.connection.count',
  MONGO_AVG:'tiers.mongodb.average',
  MONGO_MIN:'tiers.mongodb.minimum',
  MONGO_MAX: 'tiers.mongodb.maximum',
  MONGO_COUNT: 'mongodb.count',
  MYSQL_AVG: 'tiers.mysql.average',
  MYSQL_MIN: 'tiers.mysql.minimum',
  MYSQL_MAX: 'tiers.mysql.maximum',
  MYSQL_COUNT: 'mysql.count',
  REDIS_AVG: 'tiers.redis.average',
  REDIS_MIN: 'tiers.redis.minimum',
  REDIS_MAX: 'tiers.redis.maximum',
  REDIS_COUNT: 'redis.count',
  MEMCACHED_AVG: 'tiers.memcached.average',
  MEMCACHED_MIN: 'tiers.memcached.minimum',
  MEMCACHED_MAX: 'tiers.memcached.maximum',
  MEMCACHED_COUNT: 'memcached.count'
};
ApiAnalytics.value('METRICS_CONST', API_METRICS_CONST);