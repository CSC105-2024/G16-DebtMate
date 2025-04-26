/**
 * item model that handles all item-related database operations.
 * provides methods for creating and retrieving items in groups.
 * supports in-memory storage mode.
 */

import db from '../config/db.config';
import dotenv from 'dotenv';

dotenv.config();

// item model interface
interface Item {
  id: number;
  group_id: number;
  name: string;
  amount: number;
  added_by: number;
  created_at: Date;
}

// In-memory storage for items
const items: Item[] = [];
let nextItemId = 1;

// memory implementation
const memoryItemModel = {
  // Create a new item in a group
  async createItem(groupId: number, name: string, amount: number, addedBy: number): Promise<Item> {
    const newItem: Item = {
      id: nextItemId++,
      group_id: groupId,
      name,
      amount,
      added_by: addedBy,
      created_at: new Date()
    };
    
    items.push(newItem);
    return newItem;
  },
  
  // Get all items for a specific group
  async getGroupItems(groupId: number): Promise<Item[]> {
    return items.filter(item => item.group_id === groupId);
  },
  
  // Update an item
  async updateItem(itemId: number, name: string, amount: number): Promise<Item> {
    const index = items.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    items[index] = {
      ...items[index],
      name,
      amount
    };
    
    return items[index];
  },
  
  // Delete an item
  async deleteItem(itemId: number): Promise<boolean> {
    const initialLength = items.length;
    const filtered = items.filter(item => item.id !== itemId);
    
    if (initialLength === filtered.length) {
      return false;
    }
    
    items.splice(0, items.length, ...filtered);
    return true;
  }
};

// Export the model
const ItemModel = memoryItemModel;

export { Item, ItemModel };