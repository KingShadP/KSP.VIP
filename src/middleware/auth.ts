import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    // SECURITY: checkRevoked is true. This forces a backend check to ensure the token
    // hasn't been revoked, protecting against disabled/deleted user authorization bypass.
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Error verifying Firebase ID token:', error);
    if (error.code === 'auth/id-token-revoked') {
      res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    return;
  }
};
