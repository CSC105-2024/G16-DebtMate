/**
 * protects routes that require user authentication.
 * extracts and verifies the auth token from request cookies.
 * adds the user's ID to the request context for downstream handlers.
 * used by routes that need to identify the current user.
 */

import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware to enforce authentication on protected routes
 * Extracts token from cookies, verifies it, and adds userId to context
 */
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // extract auth token from cookies
    const cookies = c.req.header('Cookie') || '';
    const tokenMatch = cookies.match(/auth_token=([^;]+)/);
    
    if (!tokenMatch) {
      return c.json({ 
        success: false, 
        message: 'Authentication required' 
      }, 401);
    }
    
    const token = tokenMatch[1];
    
    // verify token and extract user ID
    const decoded = verifyToken(token);
    
    // add user ID to request context for route handlers
    c.set('userId', decoded.userId.toString());
    
    // continue to the protected route handler
    await next();
  } catch (error) {
    return c.json({ 
      success: false, 
      message: 'Invalid or expired token' 
    }, 401);
  }
};