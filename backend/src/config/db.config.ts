/**
 * database configuration that supports both postgres and in-memory modes.
 * loads database connection info from environment variables.
 * provides standardized query methods used by models for data access.
 * automatically selects implementation based on DB_MODE.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// database configuration from environment
const DB_MODE = process.env.DB_MODE || 'memory';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5433');
const DB_NAME = process.env.DB_NAME || 'debtmate';

const { Pool } = pg;

// standard interface for database operations
export interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
}

// postgres connection pool
let pgPool: pg.Pool | null = null;

// in-memory database storage (for development/testing)
const memoryDb = {
  users: [],
  friends: [],
  groups: [],
  group_members: []
};

// initialize postgres connection if needed
if (DB_MODE === 'postgres') {
  const dbConfig = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
  };
  
  pgPool = new Pool(dbConfig);
  
  // log connection attempt
  console.log('Initializing PostgreSQL connection to:', `${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}

// in-memory database implementation
const mockDb: Database = {
  query: async (text, params) => {
    // simplified query handling for memory mode
    if (text.toUpperCase().startsWith('SELECT')) {
      if (text.includes('users')) {
        return { rows: memoryDb.users };
      } else if (text.includes('friends')) {
        return { rows: memoryDb.friends };
      } else if (text.includes('groups')) {
        return { rows: memoryDb.groups };
      }
      return { rows: [] };
    } else if (text.toUpperCase().startsWith('INSERT')) {
      return { rows: [{ id: Date.now() }] }; 
    }
    
    return { rows: [] };
  },
  connect: async () => {
    return {
      query: mockDb.query,
      release: () => {}
    };
  }
};

// select database implementation based on mode
const db: Database = DB_MODE === 'postgres' && pgPool 
  ? {
      query: (text, params) => pgPool!.query(text, params),
      connect: async () => pgPool!.connect()
    }
  : mockDb;

console.log(`Using ${DB_MODE === 'postgres' ? 'PostgreSQL' : 'in-memory'} database implementation`);

export default db;