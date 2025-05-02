/**
 * handles searching for users in the system.
 * currently only has endpoint for finding users by name or username.
 * used by the AddFriends component to search for users to add.
 */

import { Context } from 'hono';
import { UserModel } from '../models/user';

const SearchController = {
  // search for users by name or username
  searchUsers: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId') || '0');
      const query = c.req.query('query');
      
      if (!query) {
        return c.json({ 
          success: false, 
          message: 'Search query is required' 
        }, 400);
      }
      
      const users = await UserModel.search(query, 10, userId);
      
      return c.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Search users error:', error);
      return c.json({ 
        success: false, 
        message: 'Failed to search users' 
      }, 500);
    }
  }
};

export default SearchController;