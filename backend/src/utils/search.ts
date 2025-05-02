/**
 * provides search functionality for finding users in the system.
 * implements pattern-matching to locate user accounts by username.
 * handles database operations with Prisma/SQLite.
 * used by search controllers to power friend discovery features.
 */

import { UserModel } from '../models/user';

// search utility functions
export const findUsersByUsername = async (searchQuery: string, currentUserId?: number, limit = 5) => {
  try {
    const users = await UserModel.search(searchQuery, limit, currentUserId);
    
    return { 
      success: true, 
      users: users
    };
  } catch (error) {
    console.error('Search users by username error:', error);
    return { 
      success: false, 
      message: 'Failed to search for users' 
    };
  }
};