/**
 * handles group management functionality.
 * provides API endpoints for creating groups and managing members.
 * uses auth middleware to ensure only logged-in users can manage groups.
 * interacts with group controller to handle business logic.
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import GroupController from '../controllers/group.controller';

// routes for group operations
const groupRoutes = new Hono();

// Create a new group
groupRoutes.post('/create', authMiddleware, GroupController.createGroup);

// Get groups for the current user
groupRoutes.get('/', authMiddleware, GroupController.getUserGroups);

// Get single group with details
groupRoutes.get('/:id', authMiddleware, GroupController.getGroupDetails);

export default groupRoutes;