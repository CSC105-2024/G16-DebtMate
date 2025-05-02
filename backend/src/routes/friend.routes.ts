import { Hono } from 'hono';
import FriendController from '../controllers/friend.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const friendRoutes = new Hono();

friendRoutes.use('*', authMiddleware);

friendRoutes.get('/', FriendController.getFriends);

friendRoutes.post('/add', FriendController.addFriend);

friendRoutes.get('/search', FriendController.searchUsers);

export default friendRoutes;