// this middleware checks if users are logged in before they can access stuff
// verifies tokens and attaches user data to the request

import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/user';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    let token = getCookie(c, 'auth_token');
    
    if (!token) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return c.json({ 
        success: false, 
        message: 'Authentication required' 
      }, 401);
    }

    const decoded = verifyToken(token);
    
    c.set('userId', decoded.userId);
    
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return c.json({ 
        success: false, 
        message: 'User not found' 
      }, 404);
    }
    
    c.set('user', user);

    await next();
  } catch (error) {
    console.error('Authentication error:', error);
    return c.json({ 
      success: false, 
      message: 'Invalid or expired token' 
    }, 401);
  }
};