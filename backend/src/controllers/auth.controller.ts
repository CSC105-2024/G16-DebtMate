// Auth controller for login and signup

import { Context } from 'hono';
import { UserModel } from '../models/user';

const AuthController = {
  // User signup handler
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      
      // check if user already exists
      if (UserModel.exists(username, email)) {
        return c.json({ 
          success: false, 
          message: 'User already exists' 
        }, 400);
      }
      
      const newUser = UserModel.create(username, email, password);
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      return c.json({ 
        success: true, 
        user: userWithoutPassword 
      }, 201);
    } catch (error) {
      return c.json({ 
        success: false, 
        message: error.message 
      }, 500);
    }
  },
  
  // User login handler
  login: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { email, password } = body;
      
      const user = UserModel.findByCredentials(email, password);
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return c.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } catch (error) {
        // oops smt went wrong
      return c.json({ 
        success: false, 
        message: error.message 
      }, 500);
    }
  }
};

export default AuthController;