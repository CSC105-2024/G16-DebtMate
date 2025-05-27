import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import * as bcrypt from 'bcrypt';
import { JWT } from '../utils/jwt';
import { UserModel } from '../models/user';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
    
  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const { username, email, name, password } = body;
      
      if (!username || !email || !password) {
        return c.json({ 
          success: false, 
          message: 'Username, email and password are required' 
        }, 400);
      }
      
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User with this email or username already exists' 
        }, 400);
      }
      
      const user = await UserModel.create(
          name || username,
        email,
        username,
        password
      );
      
      const token = JWT.generate(user.id);
      
      // set cookie so user stays logged in
      UserController.setAuthCookie(c, token);
      
      return c.json({
        success: true,
        user,
          token
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during registration' 
      }, 500);
    }
  }
  
  static async login(c: Context) {
    try {
      const { email, username, password } = await c.req.json();
      
      if (!password || (!email && !username)) {
        return c.json({ 
          success: false, 
          message: 'Email/username and password are required' 
        }, 400);
      }
      
      let user;
      // can login with either email or username
      if (email) {
        user = await UserModel.findByEmail(email);
      } else {
        user = await UserModel.findByUsername(username);
      }
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      const isValidPassword = await UserModel.validatePassword(user, password);
      if (!isValidPassword) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      const token = JWT.generate(user.id);

      UserController.setAuthCookie(c, token);

      const { password: _, ...userWithoutPassword } = user;
      
      return c.json({
        success: true,
        user: userWithoutPassword,
          token
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during login' 
      }, 500);
    }
  }
  
  static async getFriends(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'));
      
      if (isNaN(userId)) {
        return c.json({ 
          success: false, 
          message: 'Invalid user ID' 
        }, 400);
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          friends: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              bio: true,
              avatarUrl: true,
            }
          }
        }
      });
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      return c.json({
        success: true,
        friends: user.friends
      });
    } catch (error) {
      console.error('Get friends error:', error);
      return c.json({ 
        success: false, 
        message: 'Error fetching friends' 
      }, 500);
    }
  }
  
  static async addFriend(c: Context) {
    try {
      const currentUser = c.get('user');
      const { friendUsername } = await c.req.json();
      
      if (!friendUsername) {
        return c.json({ 
          success: false, 
          message: 'Friend username is required' 
        }, 400);
      }
      
      const friend = await UserModel.findByUsername(friendUsername);
      
      if (!friend) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      if (friend.id === currentUser.id) {
        return c.json({ 
          success: false, 
          message: 'Cannot add yourself as a friend' 
        }, 400);
      }
      
      await UserModel.addFriend(currentUser.id, friend.id);
      
      return c.json({
        success: true,
        message: 'Friend added successfully'
      });
    } catch (error) {
      console.error('Add friend error:', error);
      return c.json({ 
        success: false, 
        message: 'Error adding friend' 
      }, 500);
    }
  }
  
  static async getCurrentUser(c: Context) {
    try {
        const userId = c.get('userId');
      
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Not authenticated' 
        }, 401);
      }
      
      const userData = await UserModel.findById(userId);
      
      if (!userData) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      // remove password before sending to frontend
      const { password, ...userWithoutPassword } = userData;
      
      return c.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Get current user error:', error);
      return c.json({ 
        success: false, 
        message: 'Error retrieving user data' 
      }, 500);
    }
  }
  
  static async searchUsers(c: Context) {
    try {
      const userId = parseInt(c.get('user').id);
      const query = c.req.query('query');
      
      if (!query || query.length < 1) {
        return c.json({ success: false, message: 'Search query too short' }, 400);
      }
      
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { friends: true }
      });
      
      if (!currentUser) {
        return c.json({ success: false, message: 'User not found' }, 404);
      }
      
      // don't show users that are already friends
      const friendIds = currentUser.friends.map(friend => friend.id);
      
      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { username: { contains: query } },
                { email: { contains: query } },
                { name: { contains: query } }
              ]
            },
                { id: { not: userId } },
                { id: { notIn: friendIds } }
          ]
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true
        }
      });
      
      return c.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Search users error:', error);
      return c.json({ success: false, message: 'Failed to search users' }, 500);
    }
  }
  
  static async isAuthenticated(c: Context) {
    try {
      // If this endpoint is reached through authMiddleware, the user is authenticated
      // The userId will be available in the context
      const userId = c.get('userId');
      
      if (userId) {
        return c.json({
          success: true,
          isAuthenticated: true
        });
      }
      
      return c.json({
        success: false,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Authentication check error:', error);
      return c.json({ 
        success: false, 
        isAuthenticated: false
      });
    }
  }

  static async logout(c: Context) {
    try {
      setCookie(c, 'auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 0,
      });
      
      return c.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during logout' 
      }, 500);
    }
  }

  static setAuthCookie(c: Context, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    });
  }

  static async updateUser(c: Context) {
    try {
      const userId = c.get('userId');
      const { name, bio, currentPassword, newPassword, avatar } = await c.req.json();
      
      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return c.json({
          success: false,
          message: 'User not found'
        }, 404);
      }
      
      // Prepare update data
      const updateData: any = {
        name,
        bio
      };
      
      // Add avatar to update data if provided
      if (avatar) {
        updateData.avatarUrl = avatar;
      }
      
      // If password change is requested
      if (currentPassword && newPassword) {
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return c.json({
            success: false,
            message: 'Current password is incorrect'
          }, 400);
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        updateData.password = hashedPassword;
      }
      
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return c.json({
        success: true,
        user: userWithoutPassword
      });
      
    } catch (error) {
      console.error('Update user error:', error);
      return c.json({
        success: false,
        message: 'Error updating user info'
      }, 500);
    }
  }
}
