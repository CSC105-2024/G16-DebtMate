// Authentication routes for login and signup

import { Hono } from 'hono';
import AuthController from '../controllers/auth.controller';

const authRoutes = new Hono();

authRoutes.post('/signup', AuthController.signup);

authRoutes.post('/login', AuthController.login);

export default authRoutes;