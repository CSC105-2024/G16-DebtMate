/**
 * enables cross-origin resource sharing for the API.
 * allows frontend to securely make requests to the backend.
 * specifies which domains, headers, and methods are permitted.
 * applied globally in server.ts to all routes.
 */

import { cors } from 'hono/cors';

// configure cors middleware
const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // you need to change this to the ip you are running the frontend with (for example i was using 5173. but for you, you need to change it to 5174)
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
});

export default corsMiddleware;