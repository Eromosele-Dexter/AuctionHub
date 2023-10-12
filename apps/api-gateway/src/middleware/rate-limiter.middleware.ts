// src/middlewares/rateLimiter.js

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  max: 100,
  message: 'You have exceeded the 100 requests in 1 minute limit!',
  standardHeaders: true,
  legacyHeaders: false,
});
