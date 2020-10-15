'use strict';

const Redis = require('ioredis');

const redisConfig = {
  host: 'localhost',
  port: 6379,
  retryStrategy(times) {
    let delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // 断连时缓存未执行的命令，当连接恢复后再执行
};

/**
 * 获取redis客户端
 * @return {Redis} 返回redis客户端
 */
const getRedisClient = () => {

  const client = new Redis(redisConfig);

  client.on('error', function(err) {
    console.error(`Redis 连接错误 ： ${JSON.stringify(err)}`);
  });

  client.on('connect', function(err) {
    console.info('Redis 连接成功');
  });

  client.on('reconnecting', function(delay) {
    console.info(`Redis 重连： ${delay}`);
  });

  return client;
};

module.exports = {
  getRedisClient,
};
