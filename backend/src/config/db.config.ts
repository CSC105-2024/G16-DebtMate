import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Check if using PostgreSQL or in-memory mode
const DB_MODE = process.env.DB_MODE || 'memory';

// Database interface to standardize operations between memory and postgres
export interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
}

// Real PostgreSQL pool
let pgPool: pg.Pool | null = null;

// In-memory representation of database tables
const memoryDb = {
  users: [],
  friends: [],
  groups: [],
  group_members: []
};

// Initialize PostgreSQL pool if needed
if (DB_MODE === 'postgres') {
  console.log('Initializing PostgreSQL connection...');
  
  pgPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'debtmate'
  });
  
  // Test connection
  pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('PostgreSQL connection error:', err.message);
    } else {
      console.log('Connected to PostgreSQL successfully');
    }
  });
}

// Create mock database operations
const mockDb: Database = {
  query: async (text, params) => {
    console.log('Memory DB operation:', { text, params });
    
    // Very simple mock implementation - extend as needed
    if (text.toUpperCase().startsWith('SELECT')) {
      // Handle basic SELECT operations
      if (text.includes('users')) {
        return { rows: memoryDb.users };
      } else if (text.includes('friends')) {
        return { rows: memoryDb.friends };
      } else if (text.includes('groups')) {
        return { rows: memoryDb.groups };
      }
      return { rows: [] };
    } else if (text.toUpperCase().startsWith('INSERT')) {
      // Handle INSERT operations (simplified)
      return { rows: [{ id: Date.now() }] }; 
    }
    
    return { rows: [] };
  },
  connect: async () => {
    console.log('Connected to in-memory database');
    return {
      query: mockDb.query,
      release: () => console.log('Released in-memory connection')
    };
  }
};

// Return the appropriate database interface
const db: Database = DB_MODE === 'postgres' && pgPool 
  ? {
      query: (text, params) => pgPool!.query(text, params),
      connect: async () => pgPool!.connect()
    }
  : mockDb;

if (DB_MODE === 'memory') {
  console.log('Using in-memory database implementation');
} else if (DB_MODE === 'postgres') {
  console.log('Using PostgreSQL database implementation');
} else {
  console.warn(`Unknown DB_MODE: ${DB_MODE}. Defaulting to in-memory database.`);
}

export default db;