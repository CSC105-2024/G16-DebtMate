/**
 * handles user authentication business logic.
 * processes signup and login requests from auth routes.
 * interacts with UserModel for database operations and jwt utils for token generation.
 * sets secure cookies containing authentication tokens.
 */

import { Context } from 'hono';
import { UserModel } from '../models/user';
import { generateToken } from '../utils/jwt';

const AuthController = {
  // handle user signup/registration
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      
      // verify user doesn't already exist
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User already exists' 
        }, 400);
      }
      
      // create new user with hashed password
      const newUser = await UserModel.create(username, email, password);
      
      // generate authentication token
      const token = generateToken(newUser.id);
      
      // set JWT as HTTP-only cookie for security
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
  
  // handle user login
  login: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { email, password } = body;
      
      // find user by email
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // verify password is correct
      const isPasswordValid = await UserModel.validatePassword(password, user.password);
      
      if (!isPasswordValid) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // generate authentication token
      const token = generateToken(user.id);
      
      // set JWT as HTTP-only cookie for security
      c.header('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`);
      
      // don't return password in response
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