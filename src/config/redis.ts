import redis from 'redis';
import util from 'util';

import logger from '../util/logger';
import { REDIS_HOST } from '../util/secrets';

export const client = redis.createClient(REDIS_HOST);

client.on('connect', () => {
  logger.info('Redis connected.');
});

export const redisAsync = {
  del: util.promisify(client.del).bind(client),
  expire: util.promisify(client.expire).bind(client),
  get: util.promisify(client.get).bind(client),
  hmget: util.promisify(client.hmget).bind(client),
  hmgetall: util.promisify(client.hgetall).bind(client),
  hmset: util.promisify(client.hmset).bind(client),
  incr: util.promisify(client.incr).bind(client),
  set: util.promisify(client.set).bind(client),
  ttl: util.promisify(client.ttl).bind(client),
};
