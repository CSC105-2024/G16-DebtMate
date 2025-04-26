/**
 * this handles all the user login/signup stuff.
 * basically deals with the auth routes and does the heavy lifting.
 * talks to my user model for db stuff and uses jwt for those tokens.
 * sets up those secure cookies so users stay logged in.
 */

import { Context } from 'hono';
import { UserModel } from '../models/user';
import { generateToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';

const AuthController = {
  // signup function - creates new accounts
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      
      // gotta check if user exists first
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User already exists' 
        }, 400);
      }
      
      // make the new user with hashed pw
      const newUser = await UserModel.create(username, email, password);
      
      // create token for auth
      const token = generateToken(newUser.id);
      
      // cookies are better than localStorage tbh
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
  
  // login function - checks creds and gives token
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
      
      // check if password matches
      const isPasswordValid = await UserModel.validatePassword(password, user.password);
      
      if (!isPasswordValid) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // make the token with jwt
      const token = jwt.sign(
        { userId: user.id },  // hope this id exists lol
        process.env.JWT_SECRET || 'your-default-secret-key',
        { expiresIn: '7d' }
      );
      
      // set cookie with the token
      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // a week
        sameSite: 'Lax'
      });
      
      return c.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
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