import { Hono } from 'hono';
import { Context } from 'hono';
import { findUsersByUsername } from '../utils/search';
import { authMiddleware } from '../middleware/auth.middleware';
import SearchController from '../controllers/search.controller';

// 👇 Extend context variables
type Bindings = {};
type Variables = {
  userId: string;
};

const searchRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

searchRoutes.get('/users', authMiddleware, SearchController.searchUsers);

searchRoutes.get('/friends/search', authMiddleware, async (c) => {
  const query = c.req.query('query');
  const userId = parseInt(c.get('userId'));

  if (!query) {
    return c.json({ success: false, message: 'Search query is required' }, 400);
  }

  try {
    const result = await findUsersByUsername(query, userId);
    return c.json(result);
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ success: false, message: 'Failed to search for users' }, 500);
  }
});

export default searchRoutes;
