// auth routes for login and signup stuff

import { Hono } from 'hono';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

// custom variable type for our routes
type Variables = {
  userId: string;
};

const authRoutes = new Hono<{ Variables: Variables }>();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);

// route to check if user is logged in and get their info
authRoutes.get('/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  // could grab more user details here if needed
  return c.json({ 
    success: true, 
    userId
  });
});

export default authRoutes;