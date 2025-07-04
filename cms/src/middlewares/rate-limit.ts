/**
 * Rate limiting middleware for Strapi
 * Helps prevent abuse and DoS attacks
 */
import rateLimit from 'koa-ratelimit';

const db = new Map();

export default () => {
  return rateLimit({
    driver: 'memory',
    db: db,
    duration: 60000, // 1 minute
    errorMessage: 'Rate limit exceeded, please try again later.',
    id: (ctx) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 requests per minute in production
    disableHeader: false,
    whitelist: (ctx) => {
      // Allow health check endpoints
      return ctx.url === '/api' || ctx.url === '/_health' || ctx.url === '/admin';
    }
  });
};