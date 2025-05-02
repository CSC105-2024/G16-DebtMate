import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FriendController = {
  // Get all friends for the current user
  getFriends: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          friends: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            }
          }
        }
      });
      
      if (!user) {
        return c.json({ success: false, message: 'User not found' }, 404);
      }
      
      return c.json({
        success: true,
        friends: user.friends
      });
    } catch (error) {
      console.error('Get friends error:', error);
      return c.json({ success: false, message: 'Failed to retrieve friends' }, 500);
    }
  },
  
  // Add a friend (add each other as friends)
  addFriend: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      const { friendId } = await c.req.json();
      
      // Convert to number if it's a string
      const friendIdNum = typeof friendId === 'string' ? parseInt(friendId) : friendId;
      
      // Validate input
      if (!friendIdNum || isNaN(friendIdNum)) {
        return c.json({ success: false, message: 'Invalid friend ID' }, 400);
      }
      
      // Check if user is trying to add themselves
      if (userId === friendIdNum) {
        return c.json({ success: false, message: 'Cannot add yourself as a friend' }, 400);
      }
      
      // Check if friend exists
      const friend = await prisma.user.findUnique({
        where: { id: friendIdNum }
      });
      
      if (!friend) {
        return c.json({ success: false, message: 'User not found' }, 404);
      }
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: friendIdNum }
          }
        }
      });
      
      await prisma.user.update({
        where: { id: friendIdNum },
        data: {
          friends: {
            connect: { id: userId }
          }
        }
      });
      
      return c.json({
        success: true,
        message: 'Friend added successfully'
      });
    } catch (error) {
      console.error('Add friend error:', error);
      return c.json({ success: false, message: 'Failed to add friend' }, 500);
    }
  },
  
  // Search for users to add as friends
  searchUsers: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      const { query } = c.req.query();
      
      if (!query || query.length < 0) {
        return c.json({ success: false, message: 'Search query too short' }, 400);
      }
      
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { friends: true }
      });
      
      if (!currentUser) {
        return c.json({ success: false, message: 'User not found' }, 404);
      }
      
      const friendIds = currentUser.friends.map(friend => friend.id);
      
      // Search for users
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
            {
              id: { not: userId }, // Exclude current user
              id: { notIn: friendIds } // Exclude existing friends
            }
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
};

export default FriendController;