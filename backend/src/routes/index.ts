import { Hono } from 'hono';
import { UserController } from '../controllers/user.controller';
import { GroupController } from '../controllers/group.controller';
import { ItemController } from '../controllers/item.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { setCookie } from 'hono/cookie';

const api = new Hono();

// auth endpoints - no auth needed for these obviously
api.post('/auth/register', UserController.register);
api.post('/auth/login', UserController.login);
api.post('/auth/logout', (c) => {
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
});

// everything below needs auth token
const protectedRoutes = new Hono();
protectedRoutes.use('*', authMiddleware);
protectedRoutes.get('/users/me', UserController.getCurrentUser);
protectedRoutes.get('/me', UserController.isAuthenticated);
protectedRoutes.put('/users/me', UserController.updateUser);

// all the friend stuff
protectedRoutes.get('/users/:userId/friends', UserController.getFriends);
protectedRoutes.post('/users/friends', UserController.addFriend);
protectedRoutes.get('/users/friends/search', UserController.searchUsers);
protectedRoutes.get('/users/me/friends/balances', UserController.getFriendsWithBalances); // single-many balances calculation
protectedRoutes.get('/users/me/friends/:friendId/balance', UserController.getBalanceWithFriend); // single-single balance calculation


// group management endpoints
protectedRoutes.post('/groups', GroupController.createGroup);
protectedRoutes.get('/groups/:id', GroupController.getGroup);
protectedRoutes.put('/groups/:id', GroupController.updateGroup);
protectedRoutes.patch('/groups/:id', GroupController.updateGroup);
protectedRoutes.get('/users/:userId/groups', GroupController.getUserGroups);
protectedRoutes.get('/users/me/groups', GroupController.getUserGroups); // just for current user
protectedRoutes.post('/groups/:id/members', GroupController.addGroupMember);
protectedRoutes.delete('/groups/:id/members/:userId', GroupController.removeGroupMember);
protectedRoutes.put('/groups/:id/members/:userId/paid', GroupController.markMemberPaid);
protectedRoutes.put('/groups/:id/total', GroupController.updateGroupTotal);
protectedRoutes.put('/groups/:id/members/:userId/amount',  GroupController.updateMemberAmount);
// ...existing code...
// items in groups
protectedRoutes.post('/groups/:groupId/items', ItemController.createItem);
protectedRoutes.get('/items/:id', ItemController.getItem);
protectedRoutes.put('/items/:id', ItemController.updateItem);
protectedRoutes.delete('/items/:id', ItemController.deleteItem);
protectedRoutes.get('/groups/:groupId/items', ItemController.getGroupItems);


// need to prefix with /api so it doesn't mess with the root routes
api.route('/api', protectedRoutes);

export default api;