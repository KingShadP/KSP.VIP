import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.ts';

// Simple in-memory rate store
// A robust solution would use Redis or a similar store, but for this PR
// an in-memory solution is acceptable as a primary security enhancement < 50 lines.
const rateStore = new Map<string, { count: number, resetTime: number }>();

// Limit: 20 requests per 15 minutes window (900000 ms)
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 20;

export const rateLimitAI = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Use user.uid if authenticated, else IP
  const identifier = req.user?.uid || req.ip || 'unknown';

  const now = Date.now();
  const record = rateStore.get(identifier);

  if (!record) {
    rateStore.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  // If window expired, reset
  if (now > record.resetTime) {
    rateStore.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    res.status(429).json({
      error: "Too many requests. Please try again later."
    });
    return;
  }

  rateStore.set(identifier, record);
  next();
};
