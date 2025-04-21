// Auth controller for login and signup

import { Context } from 'hono';
import { UserModel } from '../models/user';
import { generateToken } from '../utils/jwt';

const AuthController = {
  // User signup handler
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      
      // check if user already exists
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User already exists' 
        }, 400);
      }
      
      // create user with hashed password
      const newUser = await UserModel.create(username, email, password);
      
      // generate JWT token
      const token = generateToken(newUser.id);
      
      // Set JWT as HTTP-only cookie
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
  
  // to handle user login handler
  login: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { email, password } = body;
      
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // Validate pass
      const isPasswordValid = await UserModel.validatePassword(password, user.password);
      
      if (!isPasswordValid) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // make JWT token
      const token = generateToken(user.id);
      
      // Set JWT as HTTP-only cookie
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
        message: error.message 
      }, 500);
    }
  }
};

export default AuthController;