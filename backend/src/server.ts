import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { fileURLToPath } from 'node:url';

import corsMiddleware from './middleware/cors.middleware';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import config from './config/app.config';

const app = new Hono();

app.use('/*', corsMiddleware);

app.get('/api/hello', (c) => {
  return c.text('yo what up from hono backend :3');
});

app.route('/api', authRoutes);
app.route('/api/search', searchRoutes); // Add the search routes

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Server is running on http://localhost:${config.port}`);
  serve({
    fetch: app.fetch,
    port: config.port
  });
}

export default app;