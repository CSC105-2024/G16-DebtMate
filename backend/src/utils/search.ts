import { UserModel } from '../models/user';

interface UserSearch {
  username: string;
}

// Function to find users by partial username match
export const findUsersByUsername = async (searchQuery: string, limit = 5) => {
  try {
    // Find users that match the search query
    const users = await UserModel.findByUsernamePattern(searchQuery, limit);
    return { success: true, users };
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, error: 'Failed to search for users' };
  }
};