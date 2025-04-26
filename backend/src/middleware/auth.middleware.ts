/**
 * keeps the sketchy users out of our protected routes lol
 * grabs the auth token from cookies and makes sure it's legit
 * sticks the user's ID into the request so we can use it later
 * basically for any routes where we need to know who's logged in
 */

import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';

/**
 * this middleware checks if ppl are logged in before letting them access stuff
 * pulls token from cookies, makes sure it's valid, adds userId to context
 */
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // grab token from cookies
    const token = getCookie(c, 'auth_token');
    
    if (!token) {
      return c.json({ success: false, message: 'Authentication required' }, 401);
    }

    // make sure the token isn't fake
    const secret = process.env.JWT_SECRET || 'your-default-secret-key';
    const decoded = jwt.verify(token, secret) as { userId: number };
    
    // pass the userId to whatever needs it next
    c.set('userId', decoded.userId.toString());
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ success: false, message: 'Invalid or expired token' }, 401);
  }
};