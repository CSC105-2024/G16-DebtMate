/**
 * this file handles all the group stuff
 * lets users make groups and get their info
 * talks to the GroupModel for db stuff
 * has endpoints for managing who's in the groups
 */

import { Context } from 'hono';
import { GroupModel } from '../models/group';

const GroupController = {
  // making a new group with members
  createGroup: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      
      // gotta check if user ID actually exists
      if (isNaN(userId)) {
        console.error('Invalid user ID in createGroup:', c.get('userId'));
        return c.json({ 
          success: false, 
          message: 'Invalid user ID' 
        }, 400);
      }
      
      console.log(`Creating group with userId: ${userId}`);
      
      const body = await c.req.json();
      const { name, description, members } = body;
      
      if (!name) {
        return c.json({ 
          success: false, 
          message: 'Group name is required' 
        }, 400);
      }
      
      // actually create the group in db
      const group = await GroupModel.createGroup(name, description || '', userId);
      
      // add people if the user included any
      if (members && Array.isArray(members) && members.length > 0) {
        const memberIds = members.map(member => member.id);
        await GroupModel.addGroupMembers(group.id, memberIds, userId);
      }
      
      return c.json({ 
        success: true,
        group 
      }, 201);
    } catch (error) {
      console.error('Create group error:', error);
      return c.json({ 
        success: false, 
        message: 'Failed to create group' 
      }, 500);
    }
  },
  
  // grab all groups the user is part of
  getUserGroups: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      const groups = await GroupModel.getUserGroups(userId);
      
      return c.json({ 
        success: true, 
        groups 
      });
    } catch (error) {
      console.error('Get user groups error:', error);
      return c.json({ 
        success: false, 
        message: 'Failed to fetch groups' 
      }, 500);
    }
  },
  
  // get all the juicy details about one specific group
  getGroupDetails: async (c: Context) => {
    try {
      const userId = parseInt(c.get('userId'));
      const groupId = parseInt(c.req.param('id'));
      
      if (isNaN(groupId)) {
        return c.json({ 
          success: false, 
          message: 'Invalid group ID' 
        }, 400);
      }
      
      const groupDetails = await GroupModel.getGroupDetails(groupId, userId);
      
      if (!groupDetails) {
        return c.json({ 
          success: false, 
          message: 'Group not found or access denied' 
        }, 404);
      }
      
      return c.json({ 
        success: true, 
        group: groupDetails 
      });
    } catch (error) {
      console.error('Get group details error:', error);
      return c.json({ 
        success: false, 
        message: 'Failed to fetch group details' 
      }, 500);
    }
  }
};

export default GroupController;