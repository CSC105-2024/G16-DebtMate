/**
 * handles user search functionality for adding friends.
 * provides the API endpoint for searching users by username.
 * uses auth middleware to ensure only logged-in users can search.
 * interacts with search utility functions to perform database queries.
 */

import { Hono } from 'hono';
import { findUsersByUsername } from '../utils/search';
import { authMiddleware } from '../middleware/auth.middleware';

// routes for searching users
const searchRoutes = new Hono();

// search for users by username
searchRoutes.get('/users', authMiddleware, async (c) => {
  const query = c.req.query('q');
  const limitStr = c.req.query('limit');
  const limit = limitStr ? parseInt(limitStr) : 5;
  
  if (!query) {
    return c.json({ success: false, error: 'search query is required' }, 400);
  }
  
  try {
    const result = await findUsersByUsername(query, limit);
    return c.json(result);
  } catch (error) {
    console.error('search error:', error);
    return c.json({ success: false, error: 'failed to search for users' }, 500);
  }
});

export default searchRoutes;