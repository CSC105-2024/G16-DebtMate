/**
 * provides user search functionality for friend discovery.
 * searches database for usernames matching a pattern.
 * used by search.routes.ts to handle API search requests.
 * interacts with UserModel to find matching users.
 */

import { UserModel } from '../models/user';

interface UserSearch {
  username: string;
}

// search utility functions
export const findUsersByUsername = async (searchQuery: string, limit = 5) => {
  try {
    // Find users that match the search query
    const users = await UserModel.findByUsernamePattern(searchQuery, limit);
    return { success: true, users };
  } catch (error) {
    console.error('search error:', error);
    return { success: false, error: 'failed to search for users' };
  }
};