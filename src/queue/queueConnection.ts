import Redis from 'ioredis';
import { config } from '../config';

export const createRedisConnection = (): Redis => {
  return new Redis({
    host: config.REDIS_HOST,
    port: parseInt(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  });
};