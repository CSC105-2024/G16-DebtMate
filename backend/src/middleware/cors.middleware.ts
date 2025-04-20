// CORS middleware config

import { cors } from 'hono/cors';

const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
});

export default corsMiddleware;