import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import api from './routes';
import dotenv from 'dotenv';

// load our env vars
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = new Hono();

// set up middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// just to make sure the server is running
app.get('/', (c) => {
  return c.json({ status: 'success', message: 'DebtMate API is running' });
});

// hook up all our routes
app.route('', api);

console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port
});