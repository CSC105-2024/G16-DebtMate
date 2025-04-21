import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Get token from cookies
    const cookies = c.req.header('Cookie') || '';
    const tokenMatch = cookies.match(/auth_token=([^;]+)/);
    
    if (!tokenMatch) {
      return c.json({ success: false, message: 'Authentication required' }, 401);
    }
    
    const token = tokenMatch[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Add user id to request for use in route handlers
    c.set('userId', decoded.userId);
    
    await next();
  } catch (error) {
    return c.json({ success: false, message: 'Invalid or expired token' }, 401);
  }
};