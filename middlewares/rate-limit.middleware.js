import 'dotenv/config';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

let redisConnectionPromise;

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    redisConnectionPromise ??= redisClient.connect().finally(() => {
      redisConnectionPromise = undefined;
    });
    await redisConnectionPromise;
  }
};

const sendRedisCommand = async (...args) => {
  await connectRedis();
  return redisClient.sendCommand(args);
};

export const apiRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: sendRedisCommand,
  }),
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
