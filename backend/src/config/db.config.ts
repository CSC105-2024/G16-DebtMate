/**
 * Database configuration for in-memory database
 * Provides query methods that our models can use
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Interface for database operations
export interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
  release?: () => void;
}

// Basic structure for our in-memory database
const memoryDb = {
  users: [],
  friends: [],
  groups: [],
  group_members: [],
  items: [],
  expenses: []
};

// Extract table names and conditions from SQL queries
const parseQuery = (text: string) => {
  const tableMatch = text.match(/FROM\s+(\w+)/i) || text.match(/INTO\s+(\w+)/i) || text.match(/UPDATE\s+(\w+)/i);
  const table = tableMatch ? tableMatch[1].toLowerCase() : null;
  
  const whereMatch = text.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
  const whereClause = whereMatch ? whereMatch[1].trim() : null;
  
  return { table, whereClause };
};

// Evaluate conditions for filtering records
const evaluateCondition = (item: any, whereClause: string) => {
  if (!whereClause) return true;
  
  const conditions = whereClause.split(/\s+AND\s+/i);
  
  return conditions.every(condition => {
    const match = condition.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
    if (!match) return true;
    
    const [, column, value] = match;
    
    if (!isNaN(Number(value))) {
      return item[column] == Number(value);
    }
    
    return item[column] == value;
  });
};

// In-memory database implementation
const mockDb: Database = {
  query: async (text, params = []) => {
    const { table, whereClause } = parseQuery(text);
    
    // Handle parameter replacement
    let parsedWhereClause = whereClause;
    if (whereClause && params?.length) {
      parsedWhereClause = whereClause.replace(/\$\d+/g, (match) => {
        const paramIndex = parseInt(match.substring(1)) - 1;
        return typeof params[paramIndex] === 'string' ? 
          `'${params[paramIndex]}'` : params[paramIndex];
      });
    }
    
    try {
      // SELECT queries
      if (text.toUpperCase().startsWith('SELECT')) {
        if (!table || !memoryDb[table]) {
          return { rows: [] };
        }
        
        const rows = parsedWhereClause ? 
          memoryDb[table].filter(item => evaluateCondition(item, parsedWhereClause)) : 
          memoryDb[table];
          
        return { rows };
      } 
      // INSERT queries
      else if (text.toUpperCase().startsWith('INSERT')) {
        const match = text.match(/INSERT\s+INTO\s+\w+\s*\((.+?)\)\s*VALUES\s*\((.+?)\)/i);
        
        if (match && table) {
          const columns = match[1].split(',').map(col => col.trim());
          let values = match[2].split(',').map(val => val.trim());
          
          if (params?.length) {
            values = params;
          }
          
          const newRecord: any = { id: Date.now() + Math.floor(Math.random() * 1000) };
          columns.forEach((col, index) => {
            newRecord[col] = values[index];
          });
          
          if (memoryDb[table]) {
            memoryDb[table].push(newRecord);
            return { rows: [{ id: newRecord.id }] };
          }
        }
        return { rows: [{ id: Date.now() }] };
      }
      // UPDATE queries
      else if (text.toUpperCase().startsWith('UPDATE')) {
        if (table && memoryDb[table] && parsedWhereClause) {
          const setMatch = text.match(/SET\s+(.+?)\s+WHERE/i);
          if (setMatch) {
            const setClause = setMatch[1];
            
            const updates = setClause.split(',').map(pair => pair.trim());
            
            memoryDb[table].forEach((record, index) => {
              if (evaluateCondition(record, parsedWhereClause)) {
                updates.forEach(update => {
                  const [col, val] = update.split('=').map(part => part.trim());
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
      // DELETE queries
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

console.log('Using in-memory database implementation');

// Add test users for development
export const ensureTestUsers = async () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    console.log('Checking for test users...');
    
    const result = await mockDb.query('SELECT id FROM users WHERE id = 12');
    
    if (result.rows.length === 0) {
      console.log('Creating test user with ID 12...');
      
      await mockDb.query(`
        INSERT INTO users (id, name, username, email, password)
        VALUES (12, 'Test User', 'testuser', 'test@example.com', 'hashedpassword')
      `);
    }
  } catch (error) {
    console.error('Error ensuring test users:', error);
  }
};

// Export the database instance
const db: Database = mockDb;
export default db;