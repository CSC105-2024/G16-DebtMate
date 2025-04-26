/**
 * item model that handles all item-related database operations.
 * provides methods for creating and retrieving items in groups.
 * supports both postgres and in-memory storage modes.
 */

import db from '../config/db.config';
import dotenv from 'dotenv';

dotenv.config();

// control which database implementation to use
const DB_MODE = process.env.DB_MODE || 'memory';

// item model interface
interface Item {
  id: number;
  group_id: number;
  name: string;
  amount: number;
  added_by: number;
  created_at: Date;
}

// postgres database operations
const pgItemModel = {
  // Create a new item in a group
  async createItem(groupId: number, name: string, amount: number, addedBy: number): Promise<Item> {
    const query = `
      INSERT INTO items (group_id, name, amount, added_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [groupId, name, amount, addedBy]);
    return result.rows[0];
  },
  
  // Get all items for a specific group
  async getGroupItems(groupId: number): Promise<Item[]> {
    const query = `
      SELECT * FROM items
      WHERE group_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [groupId]);
    return result.rows;
  },
  
  // Update an item
  async updateItem(itemId: number, name: string, amount: number): Promise<Item> {
    const query = `
      UPDATE items
      SET name = $2, amount = $3
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [itemId, name, amount]);
    return result.rows[0];
  },
  
  // Delete an item
  async deleteItem(itemId: number): Promise<boolean> {
    const query = `
      DELETE FROM items
      WHERE id = $1
    `;
    
    const result = await db.query(query, [itemId]);
    return result.rowCount > 0;
  }
};

// in-memory storage for items
const memoryItemModel = {
  // Create a new item in a group
  async createItem(groupId: number, name: string, amount: number, addedBy: number): Promise<Item> {
    const query = `
      INSERT INTO items (group_id, name, amount, added_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [groupId, name, amount, addedBy]);
    return result.rows[0];
  },
  
  // Get all items for a specific group
  async getGroupItems(groupId: number): Promise<Item[]> {
    const query = `
      SELECT * FROM items
      WHERE group_id = $1
    `;
    
    const result = await db.query(query, [groupId]);
    return result.rows;
  },
  
  // Update an item
  async updateItem(itemId: number, name: string, amount: number): Promise<Item> {
    const query = `
      UPDATE items
      SET name = $2, amount = $3
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [itemId, name, amount]);
    return result.rows[0];
  },
  
  // Delete an item
  async deleteItem(itemId: number): Promise<boolean> {
    const query = `
      DELETE FROM items
      WHERE id = $1
    `;
    
    const result = await db.query(query, [itemId]);
    return result.rowCount > 0;
  }
};

// Export the appropriate model based on DB_MODE
const ItemModel = DB_MODE === 'postgres' 
  ? pgItemModel
  : memoryItemModel;

export { Item, ItemModel };