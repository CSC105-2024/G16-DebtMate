import { Hono } from 'hono';
import { findUsersByUsername } from '../utils/search';
import { authMiddleware } from '../middleware/auth.middleware';

const searchRoutes = new Hono();

// Route to search for users by username
searchRoutes.get('/users', authMiddleware, async (c) => {
  const query = c.req.query('q');
  const limitStr = c.req.query('limit');
  const limit = limitStr ? parseInt(limitStr) : 5;
  
  if (!query) {
    return c.json({ success: false, error: 'Search query is required' }, 400);
  }
  
  try {
    const result = await findUsersByUsername(query, limit);
    return c.json(result);
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ success: false, error: 'Failed to search for users' }, 500);
  }
});

export default searchRoutes;