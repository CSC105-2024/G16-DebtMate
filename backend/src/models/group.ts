/**
 * Group model for managing group data
 */

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
  added_at: Date;
}

// Simple in-memory store
const groups: Group[] = [];
let nextGroupId = 1;
const groupMembers: GroupMember[] = [];

export const GroupModel = {
  async createGroup(name: string, description: string, userId: number): Promise<Group> {
    const newGroup: Group = {
      id: nextGroupId++,
      name,
      description,
      created_by: userId,
      created_at: new Date()
    };
    
    groups.push(newGroup);
    return newGroup;
  },
  
  async addMember(groupId: number, userId: number): Promise<void> {
    groupMembers.push({
      group_id: groupId,
      user_id: userId,
      added_at: new Date()
    });
  },
  
  async getGroupsByUserId(userId: number): Promise<Group[]> {
    const memberGroupIds = groupMembers
      .filter(gm => gm.user_id === userId)
      .map(gm => gm.group_id);
    
    return groups.filter(group => memberGroupIds.includes(group.id));
  }
};