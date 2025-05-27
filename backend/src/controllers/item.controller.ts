import { Context } from 'hono';
import prisma from '../config/prisma.config';
import { data } from 'react-router-dom';

export class ItemController {
  static async createItem(c: Context) {
    try {
      const groupId = parseInt(c.req.param('groupId'));
      const { name, amount, userAssignments } = await c.req.json();
      
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { owner: true }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const item = await prisma.item.create({
        data: {
          name,
          amount,
          groupId
        }
      });
      
      // need to assign costs to specific users and update what they owe
      if (userAssignments && Array.isArray(userAssignments)) {
        for (const assignment of userAssignments) {
          const { userId, amount } = assignment;
          
          const member = await prisma.groupMember.findUnique({
            where: {
              userId_groupId: {
                userId,
                groupId
              }
            }
          });
          
          if (member) {
            await prisma.itemUser.create({
              data: {
                itemId: item.id,
                userId: typeof userId === 'string' ? parseInt(userId, 10) : userId,
                amount
              }
            });
            
            // Don't increment what the owner owes if they're part of this item
            if (userId !== group.ownerId) {
              await prisma.groupMember.update({
                where: {
                  userId_groupId: {
                    userId,
                    groupId
                  }
                },
                data: {
                  amountOwed: {
                    increment: amount
                  }
                }
              });
            }
          }
        }
      }
      
      // update the group total with this new item
      await prisma.group.update({
        where: { id: groupId },
        data: {
          total: {
            increment: amount
          }
        }
      });
      
      const completeItem = await prisma.item.findUnique({
        where: { id: item.id },
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
      });
      
      return c.json(completeItem, 201);
    } catch (error) {
      console.error('Create item error:', error);
      return c.json({ message: 'Server error while creating item' }, 500);
    }
  }
  
  static async getItem(c: Context) {
    try {
      const itemId = parseInt(c.req.param('id'));
      
      const item = await prisma.item.findUnique({
        where: { id: itemId },
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
      });
      
      if (!item) {
        return c.json({ message: 'Item not found' }, 404);
      }
      
      return c.json(item);
    } catch (error) {
      console.error('Get item error:', error);
      return c.json({ message: 'Server error while fetching item' }, 500);
    }
  }
  
  static async updateItem(c: Context) {
    try {
      const itemId = parseInt(c.req.param('id'));
      const { name, amount, userAssignments } = await c.req.json();
      
      const item = await prisma.item.findUnique({
        where: { id: itemId }
      });
      
      if (!item) {
        return c.json({ message: 'Item not found' }, 404);
      }
      
      // keep track of original amount to calculate the difference
      const oldAmount = item.amount;
      
      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          name,
          amount
        }
      });
      
      // update the total for the group based on the difference
      await prisma.group.update({
        where: { id: item.groupId },
        data: {
          total: {
            increment: amount - oldAmount
          }
        }
      });
      
      // handle user assignments. first remove the old ones then add the new ones
      if (userAssignments && Array.isArray(userAssignments)) {
        const existingAssignments = await prisma.itemUser.findMany({
          where: { itemId }
        });
        
        // Get the current group members with their paid status
        const groupMembers = await prisma.groupMember.findMany({
          where: {
            groupId: item.groupId
          }
        });
        
        for (const assignment of existingAssignments) {
          const member = groupMembers.find(m => m.userId === assignment.userId);
          
          if (member && !member.isPaid) {
            await prisma.groupMember.update({
              where: {
                userId_groupId: {
                  userId: assignment.userId,
                  groupId: item.groupId
                }
              },
              data: {
                amountOwed: {
                  decrement: assignment.amount
                }
              }
            });
          }
        }
        
        // clean out the old assignments
        await prisma.itemUser.deleteMany({
          where: { itemId }
        });
        
        // add all the new ones
        for (const assignment of userAssignments) {
          const { userId, amount } = assignment;
          
          await prisma.itemUser.create({
            data: {
              itemId,
              userId: typeof userId === 'string' ? parseInt(userId, 10) : userId,
              amount
            }
          });
          
          const member = groupMembers.find(m => m.userId === (typeof userId === 'string' ? parseInt(userId, 10) : userId));
          
          if (member && !member.isPaid) {
            await prisma.groupMember.update({
              where: {
                userId_groupId: {
                  userId,
                  groupId: item.groupId
                }
              },
              data: {
                amountOwed: {
                  increment: amount
                }
              }
            });
          }
        }
      }
      
      const completeItem = await prisma.item.findUnique({
        where: { id: itemId },
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
      });
      
      return c.json(completeItem);
    } catch (error) {
      console.error('Update item error:', error);
      return c.json({ message: 'Server error while updating item' }, 500);
    }
  }
  
  static async deleteItem(c: Context) {
  try {
    const itemId = parseInt(c.req.param('id'));
    
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        users: true
      }
    });
    
    if (!item) {
      return c.json({ message: 'Item not found' }, 404);
    }
    
    await prisma.itemUser.deleteMany({
      where: { itemId }
    });
    
    await prisma.item.delete({
      where: { id: itemId }
    });
    
    return c.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    return c.json({ message: 'Server error while deleting item' }, 500);
  }
}

  
  static async getGroupItems(c: Context) {
    try {
      const groupId = parseInt(c.req.param('groupId'));
      
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const items = await prisma.item.findMany({
        where: { groupId },
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
      });
      
      return c.json(items);
    } catch (error) {
      console.error('Get group items error:', error);
      return c.json({ message: 'Server error while fetching group items' }, 500);
    }
  }
}