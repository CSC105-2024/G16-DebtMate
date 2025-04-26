/**
 * made this so we can switch between postgres and in-memory db
 * grabs connection stuff from env vars
 * has some nice query methods that our models can use
 * auto picks which db to use based on DB_MODE
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// gotta load those env vars somehow
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// grabbed this stuff from the .env file
const DB_MODE = process.env.DB_MODE || 'memory';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5433');
const DB_NAME = process.env.DB_NAME || 'debtmate';

const { Pool } = pg;

// interface so both db types work the same way
export interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
  release?: () => void;
}

// need this for postgres connection
let pgPool: pg.Pool | null = null;

// basic structure for our fake db - just some arrays lol
const memoryDb = {
  users: [],
  friends: [],
  groups: [],
  group_members: [],
  items: [],
  expenses: []
};

// setting up postgres if that's what we're using
if (DB_MODE === 'postgres') {
  const dbConfig = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
  };
  
  pgPool = new Pool(dbConfig);
  
  // just to see what's happening
  console.log('Initializing PostgreSQL connection to:', `${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  
  // making sure postgres is alive
  pgPool.query('SELECT NOW()')
    .then(() => {
      console.log('PostgreSQL connection successful');
      console.log('\x1b[42m\x1b[37m DATABASE SUCCESS \x1b[0m PostgreSQL connection established successfully');
    })
    .catch(err => {
      console.error('PostgreSQL connection error:', err.message);
      console.error('\x1b[41m\x1b[37m DATABASE ERROR \x1b[0m PostgreSQL connection failed! Falling back to in-memory database mode');
      // if postgres is dead, we'll just use memory db
      process.env.DB_MODE = 'memory';
    });
}

// this function extracts table names and stuff from SQL queries
const parseQuery = (text: string) => {
  // regex to find what table we're hitting
  const tableMatch = text.match(/FROM\s+(\w+)/i) || text.match(/INTO\s+(\w+)/i) || text.match(/UPDATE\s+(\w+)/i);
  const table = tableMatch ? tableMatch[1].toLowerCase() : null;
  
  // pull out any WHERE conditions
  const whereMatch = text.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
  const whereClause = whereMatch ? whereMatch[1].trim() : null;
  
  return { table, whereClause };
};

// checks if a record matches our where condition
const evaluateCondition = (item: any, whereClause: string) => {
  if (!whereClause) return true;
  
  // split up conditions if there's multiple with AND
  const conditions = whereClause.split(/\s+AND\s+/i);
  
  return conditions.every(condition => {
    // just handling basic equals for now
    const match = condition.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
    if (!match) return true; // skip anything complicated
    
    const [, column, value] = match;
    
    // handle numbers differently
    if (!isNaN(Number(value))) {
      return item[column] == Number(value);
    }
    
    // handle strings
    return item[column] == value;
  });
};

// my fake db implementation - not perfect but it works for now
const mockDb: Database = {
  query: async (text, params = []) => {
    // figure out what we're doing
    const { table, whereClause } = parseQuery(text);
    
    // handle those $1, $2 things in prepared statements
    let parsedWhereClause = whereClause;
    if (whereClause && params?.length) {
      parsedWhereClause = whereClause.replace(/\$\d+/g, (match) => {
        const paramIndex = parseInt(match.substring(1)) - 1;
        return typeof params[paramIndex] === 'string' ? 
          `'${params[paramIndex]}'` : params[paramIndex];
      });
    }
    
    try {
      // for SELECT queries
      if (text.toUpperCase().startsWith('SELECT')) {
        if (!table || !memoryDb[table]) {
          return { rows: [] };
        }
        
        // filter based on where clause
        const rows = parsedWhereClause ? 
          memoryDb[table].filter(item => evaluateCondition(item, parsedWhereClause)) : 
          memoryDb[table];
          
        return { rows };
      } 
      // for INSERT queries
      else if (text.toUpperCase().startsWith('INSERT')) {
        // pull out column names and values
        const match = text.match(/INSERT\s+INTO\s+\w+\s*\((.+?)\)\s*VALUES\s*\((.+?)\)/i);
        if (match && table) {
          const columns = match[1].split(',').map(col => col.trim());
          let values = match[2].split(',').map(val => val.trim());
          
          // use params if we got them
          if (params?.length) {
            values = params;
          }
          
          // make a new record with random id
          const newRecord: any = { id: Date.now() + Math.floor(Math.random() * 1000) };
          columns.forEach((col, index) => {
            newRecord[col] = values[index];
          });
          
          // add to our fake db
          if (memoryDb[table]) {
            memoryDb[table].push(newRecord);
            return { rows: [{ id: newRecord.id }] };
          }
        }
        return { rows: [{ id: Date.now() }] };
      }
      // for UPDATE queries
      else if (text.toUpperCase().startsWith('UPDATE')) {
        if (table && memoryDb[table] && parsedWhereClause) {
          // get the SET part
          const setMatch = text.match(/SET\s+(.+?)\s+WHERE/i);
          if (setMatch) {
            const setClause = setMatch[1];
            const updates = setClause.split(',').map(pair => pair.trim());
            
            // find records and update them
            memoryDb[table].forEach((record, index) => {
              if (evaluateCondition(record, parsedWhereClause)) {
                updates.forEach(update => {
                  const [col, val] = update.split('=').map(part => part.trim());
                  // remove quotes around strings
                  const parsedVal = val.replace(/^['"](.+?)['"]$/, '$1');
                  memoryDb[table][index][col] = parsedVal;
                });
              }
            });
            
            return { rowCount: 1 };
          }
        }
        return { rowCount: 0 };
      }
      // for DELETE queries
      else if (text.toUpperCase().startsWith('DELETE')) {
        if (table && memoryDb[table] && parsedWhereClause) {
          const initialCount = memoryDb[table].length;
          memoryDb[table] = memoryDb[table].filter(
            item => !evaluateCondition(item, parsedWhereClause)
          );
          const deletedCount = initialCount - memoryDb[table].length;
          return { rowCount: deletedCount };
        }
        return { rowCount: 0 };
      }
    } catch (error) {
      console.error('Error in in-memory database query:', error);
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

// pick which db to use based on our env var
const db: Database = DB_MODE === 'postgres' && pgPool 
  ? {
      query: async (text, params) => {
        try {
          return await pgPool!.query(text, params);
        } catch (err) {
          console.error('PostgreSQL query error:', err.message);
          console.error('Failed query:', text, params);
          throw err;
        }
      },
      connect: async () => {
        try {
          return await pgPool!.connect();
        } catch (err) {
          console.error('PostgreSQL connection error:', err.message);
          throw err;
        }
      }
    }
  : mockDb;

console.log(`Using ${DB_MODE === 'postgres' ? 'PostgreSQL' : 'in-memory'} database implementation`);

// this adds some fake users for testing so i don't have to keep creating them
export const ensureTestUsers = async () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    console.log('Checking for test users...');
    
    // my test account id - makes debugging way easier
    const result = await db.query('SELECT id FROM users WHERE id = 12');
    
    if (result.rows.length === 0) {
      console.log('Creating test user with ID 12...');
      
      // password is just "password" btw
      await db.query(`
        INSERT INTO users (id, name, username, email, password)
        VALUES (12, 'Test User', 'testuser12', 'test12@example.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm')
        ON CONFLICT (id) DO NOTHING
      `);
      
      console.log('Test user created successfully');
    }
  } catch (error) {
    console.error('Error ensuring test users exist:', error);
  }
};

export default db;