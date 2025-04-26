/**
 * group stuff for handling all database operations
 * got methods for making groups and getting member info
 * works with both postgres and memory storage (for testing)
 * group.controller.ts uses this for all the group management
 */

import db from '../config/db.config';
import dotenv from 'dotenv';

dotenv.config();

// switch between db types - memory is for testing
const DB_MODE = process.env.DB_MODE || 'memory';

// interfaces so typescript doesn't yell at me
interface Group {
  id: number;
  name: string;
  description: string;
  created_by: number;
  created_at: Date;
}

interface GroupMember {
  group_id: number;
  user_id: number;
  added_by: number;
  added_at: Date;
}

// in-memory arrays for when we're testing stuff
const groups: Group[] = [];
const groupMembers: GroupMember[] = [];
let nextGroupId = 1;

// postgres implementation 
const pgGroupModel = {
  async createGroup(name: string, description: string, createdBy: number): Promise<any> {
    try {
      // gotta check if user exists first, if not make a fake one for dev
      const userExists = await db.query('SELECT id FROM users WHERE id = $1', [createdBy]);
      
      if (userExists.rows.length === 0) {
        // just making a placeholder user for now
        await db.query(
          'INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5)',
          [createdBy, `Mock User ${createdBy}`, `mockuser${createdBy}`, `mock${createdBy}@example.com`, 'mockhash']
        );
        console.log(`Created mock user with ID: ${createdBy} for development`);
      }
      
      // actually create the group now
      const result = await db.query(
        'INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        [name, description, createdBy]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  },

  async addGroupMembers(groupId: number, memberIds: number[], addedBy: number): Promise<void> {
    // don't bother if there's nobody to add
    if (memberIds.length === 0) return;
    
    try {
      // make sure all these users exist in the db
      for (const memberId of memberIds) {
        const userExists = await db.query('SELECT id FROM users WHERE id = $1', [memberId]);
        
        if (userExists.rows.length === 0) {
          // just create a fake user for testing
          await db.query(
            'INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5)',
            [memberId, `Mock User ${memberId}`, `mockuser${memberId}`, `mock${memberId}@example.com`, 'mockhash']
          );
          console.log(`Created mock user with ID: ${memberId} for development`);
        }
      }
      
      // also check the person adding them exists
      const adderExists = await db.query('SELECT id FROM users WHERE id = $1', [addedBy]);
      
      if (adderExists.rows.length === 0) {
        await db.query(
          'INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5)',
          [addedBy, `Mock User ${addedBy}`, `mockuser${addedBy}`, `mock${addedBy}@example.com`, 'mockhash']
        );
        console.log(`Created mock user with ID: ${addedBy} for development`);
      }
      
      // this is a cool trick to add multiple members at once
      const values = memberIds.map((_, index) => 
        `($1, $${index + 2}, $${memberIds.length + 2})`
      ).join(', ');
      
      const params = [groupId, ...memberIds, addedBy];
      
      await db.query(
        `INSERT INTO group_members (group_id, user_id, added_by) VALUES ${values}`,
        params
      );
    } catch (error) {
      console.error('Error adding group members:', error);
      throw error;
    }
  },
  
  async getUserGroups(userId: number): Promise<Group[]> {
    // grab groups where they're either the creator or a member
    const result = await db.query(
      `SELECT g.* FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       WHERE g.created_by = $1 OR gm.user_id = $1
       GROUP BY g.id
       ORDER BY g.created_at DESC`,
      [userId]
    );
    return result.rows;
  },
  
  async getGroupDetails(groupId: number, userId: number): Promise<any> {
    // make sure they're allowed to see this group
    const accessCheck = await db.query(
      `SELECT 1 FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       WHERE (g.id = $1 AND (g.created_by = $2 OR gm.user_id = $2))
       LIMIT 1`,
      [groupId, userId]
    );
    
    if (accessCheck.rows.length === 0) {
      return null; // nope, no access for you
    }
    
    // get the basic group info
    const groupResult = await db.query(
      'SELECT * FROM groups WHERE id = $1',
      [groupId]
    );
    
    if (groupResult.rows.length === 0) {
      return null; // group doesn't exist anymore?
    }
    
    // get all the people in this group
    const membersResult = await db.query(
      `SELECT u.id, u.name, u.username, u.email
       FROM users u
       JOIN group_members gm ON u.id = gm.user_id
       WHERE gm.group_id = $1`,
      [groupId]
    );
    
    return {
      ...groupResult.rows[0],
      members: membersResult.rows
    };
  }
};

// memory version for when we're testing without db
const memoryGroupModel = {
  createGroup: async (name: string, description: string, userId: number): Promise<Group> => {
    console.log(`Memory DB: Creating group with name: ${name}, userId: ${userId}`);
    
    // gotta convert this to a number just in case
    const creatorId = Number(userId);
    
    const newGroup: Group = {
      id: nextGroupId++,
      name,
      description,
      created_by: creatorId,
      created_at: new Date()
    };
    
    groups.push(newGroup);
    console.log(`Memory DB: Created group with ID: ${newGroup.id}`);
    return newGroup;
  },
  
  addGroupMembers: async (groupId: number, memberIds: number[], addedBy: number): Promise<void> => {
    for (const memberId of memberIds) {
      const newMember: GroupMember = {
        group_id: groupId,
        user_id: memberId,
        added_by: addedBy,
        added_at: new Date()
      };
      groupMembers.push(newMember);
    }
  },
  
  getUserGroups: async (userId: number): Promise<Group[]> => {
    // find their groups - either ones they made or are part of
    const userGroups = groups.filter(group => 
      group.created_by === userId || 
      groupMembers.some(member => member.group_id === group.id && member.user_id === userId)
    );
    
    return userGroups.sort((a, b) => 
      b.created_at.getTime() - a.created_at.getTime()
    );
  },
  
  getGroupDetails: async (groupId: number, userId: number): Promise<any> => {
    // find the group
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;
    
    // make sure they're allowed to see it
    const hasAccess = 
      group.created_by === userId || 
      groupMembers.some(member => member.group_id === groupId && member.user_id === userId);
    
    if (!hasAccess) return null;
    
    // get who's in the group
    const members = groupMembers
      .filter(member => member.group_id === groupId)
      .map(member => ({ id: member.user_id }));
    
    return {
      ...group,
      members
    };
  }
};

// pick which implementation to use based on env var
const GroupModel = DB_MODE === 'postgres' 
  ? pgGroupModel
  : memoryGroupModel;

export { Group, GroupMember, GroupModel };