import { Context } from 'hono';
import prisma from '../config/prisma.config';

export class GroupController {
  static async createGroup(c: Context) {
    try {
      const { name, description, icon, members } = await c.req.json();
      const currentUser = c.get('user');
      
      const group = await prisma.group.create({
        data: {
          name,
          description,
          icon,
          ownerId: currentUser.id, // Set the current user as owner
          members: {
            create: {
              userId: currentUser.id,
            }
          }
        }
      });
      
      // loop through and add all the members
      if (members && Array.isArray(members)) {
        for (const memberId of members) {
          const userExists = await prisma.user.findUnique({
            where: { id: memberId }
          });
          
          if (userExists && memberId !== currentUser.id) {
            await prisma.groupMember.create({
              data: {
                userId: memberId,
                groupId: group.id
              }
            });
          }
        }
      }
      
      const completeGroup = await prisma.group.findUnique({
        where: { id: group.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              username: true,
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      return c.json(completeGroup, 201);
    } catch (error) {
      console.error('Create group error:', error);
      return c.json({ message: 'Server error while creating group' }, 500);
    }
  }
  
  static async getGroup(c: Context) {
    try {
      const groupId = parseInt(c.req.param('id'));
      
      // grab everything we need in one query, this is way more efficient
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true
                }
              }
            }
          },
          items: {
            include: {
              users: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true
                    }
                  }
                }
              }
            }
          },
          payments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true
                }
              }
            }
          }
        }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      return c.json(group);
    } catch (error) {
      console.error('Get group error:', error);
      return c.json({ message: 'Server error while fetching group' }, 500);
    }
  }
  
  static async updateGroup(c: Context) {
    try {
      const groupId = parseInt(c.req.param('id'));
      const { name, description, icon, serviceCharge, tax } = await c.req.json();
      
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          name,
          description,
          icon,
          serviceCharge,
          tax
        }
      });
      
      return c.json(updatedGroup);
    } catch (error) {
      console.error('Update group error:', error);
      return c.json({ message: 'Server error while updating group' }, 500);
    }
  }
  
  static async getUserGroups(c: Context) {
    try {
      let userId: number;
      
      // figure out if we're getting current user's groups or someone else's
      if (c.req.path.includes('/users/me/groups')) {
        const currentUser = c.get('user');
        userId = currentUser.id;
      } else {
        userId = parseInt(c.req.param('userId'));
      }
      
      const userGroups = await prisma.group.findMany({
        where: {
          members: {
            some: {
              userId
            }
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true
                }
              }
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });
      
      return c.json(userGroups);
    } catch (error) {
      console.error('Get user groups error:', error);
      return c.json({ message: 'Server error while fetching user groups' }, 500);
    }
  }
  
  static async addGroupMember(c: Context) {
    try {
      const groupId = parseInt(c.req.param('id'));
      const { userId } = await c.req.json();
      
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return c.json({ message: 'User not found' }, 404);
      }
      
      // check if they're already in the group
      const existingMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });
      
      if (existingMember) {
        return c.json({ message: 'User is already a member of this group' }, 400);
      }
      
      const member = await prisma.groupMember.create({
        data: {
          userId,
          groupId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true
            }
          }
        }
      });
      
      return c.json(member);
    } catch (error) {
      console.error('Add group member error:', error);
      return c.json({ message: 'Server error while adding group member' }, 500);
    }
  }
  
  static async removeGroupMember(c: Context) {
    try {
      const groupId = parseInt(c.req.param('id'));
      const userId = parseInt(c.req.param('userId'));
      
      const member = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });
      
      if (!member) {
        return c.json({ message: 'User is not a member of this group' }, 404);
      }
      
      await prisma.groupMember.delete({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });
      
      return c.json({ message: 'Member removed successfully' });
    } catch (error) {
      console.error('Remove group member error:', error);
      return c.json({ message: 'Server error while removing group member' }, 500);
    }
  }
  
  static async markMemberPaid(c: Context) {
    try {
      const groupId = parseInt(c.req.param('id'));
      const userId = parseInt(c.req.param('userId'));
      const { isPaid } = await c.req.json();
      
      const member = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });
      
      if (!member) {
        return c.json({ message: 'User is not a member of this group' }, 404);
      }
      
      const updatedMember = await prisma.groupMember.update({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        },
        data: {
          isPaid: isPaid
        }
      });
      
      return c.json(updatedMember);
    } catch (error) {
      console.error('Mark member paid error:', error);
      return c.json({ message: 'Server error while updating payment status' }, 500);
    }
  }
}