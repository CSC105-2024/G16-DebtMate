/**
 * main server entry point that initializes the application.
 * sets up api routes, middleware, and starts the http server.
 * imports routes from auth.routes.ts and search.routes.ts.
 * configures CORS to allow frontend to make requests.
 */

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { fileURLToPath } from 'node:url';

// import middleware and routes
import corsMiddleware from './middleware/cors.middleware';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import friendRoutes from './routes/friend.routes';
import groupRoutes from './routes/group.routes';
import config from './config/app.config';

// create the main application
const app = new Hono();

// apply global middleware
app.use('*', corsMiddleware);

// register API routes
app.route('/api', authRoutes);
app.route('/api/search', searchRoutes);  
app.route('/api/friends', friendRoutes);
app.route('/api/groups', groupRoutes);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.environment}`);
  
  serve({
    fetch: app.fetch,
    port: config.port
  });
}

export default app;