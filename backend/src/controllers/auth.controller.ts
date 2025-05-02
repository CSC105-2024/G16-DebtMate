/**
 * this handles all the user login/signup stuff.
 * basically deals with the auth routes and does the heavy lifting.
 * talks to my user model for db stuff and uses jwt for those tokens.
 * sets up those secure cookies so users stay logged in.
 */

import { Context } from 'hono';
import { UserModel } from '../models/user';
import { generateToken } from '../utils/jwt';

const AuthController = {
  // signup function - creates new accounts
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { username, email, password, name } = body;
      
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User already exists' 
        }, 400);
      }
      
      const newUser = await UserModel.create(name || username, email, username, password);
      
      // create token for auth
      const token = generateToken(newUser.id);
      
      c.header('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`);
      
      return c.json({ 
        success: true, 
        user: newUser
      }, 201);
    } catch (error) {
      console.error('Signup error:', error);
      return c.json({ 
        success: false, 
        message: 'An error occurred during signup' 
      }, 500);
    }
  },
  
  login: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { email, password } = body;
      
      // find the user by email
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // check password
      const isValid = await UserModel.validatePassword(user, password);
      
      if (!isValid) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // generate auth token
      const token = generateToken(user.id);
      
      c.header('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`);
      
      const { password: _, ...userWithoutPassword } = user;
      
      return c.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ 
        success: false, 
        message: 'An error occurred during login' 
      }, 500);
    }
  },
  
  me: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      
      if (isNaN(userId)) {
        return c.json({ 
          success: false, 
          message: 'Not authenticated' 
        }, 401);
      }
      
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return c.json({ 
        success: true, 
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Get me error:', error);
      return c.json({ 
        success: false, 
        message: 'An error occurred' 
      }, 500);
    }
  },
  
  logout: async (c: Context) => {
    try {
      c.header('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0');
      
      return c.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return c.json({
        success: false,
        message: 'Failed to logout'
      }, 500);
    }
  }
};

export default AuthController;