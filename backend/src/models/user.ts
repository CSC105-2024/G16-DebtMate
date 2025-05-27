/**
 * User model containing database operations for user management
 * Handles authentication, profile data, and relationships
 */

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserModel = {
  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  },
  
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  },
  
  async exists(username: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    return !!user;
  },
  
  async create(name: string, email: string, username: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword
      }
    });
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  async validatePassword(user: any, password: string) {
    return bcrypt.compare(password, user.password);
  },
  
  async search(query: string, limit: number = 10, currentUserId?: number) {
    let whereClause: any = {
      OR: [
        { username: { contains: query } },
        { email: { contains: query } },
        { name: { contains: query } }
      ]
    };
    
    if (currentUserId) {
      whereClause = {
        AND: [
          whereClause,
          { id: { not: currentUserId } }
        ]
      };
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        email: true
      }
    });
    
    return users;
  },

  async createUser(userData: { username: string; email: string; password: string; name?: string }) {
    return prisma.user.create({
      data: userData
    });
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        friends: true,
        groupMemberships: {
          include: {
            group: true
          }
        }
      }
    });
  },

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  async getUsersById(ids: number[]) {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  },

  async addFriend(userId: number, friendId: number) {
    return prisma.$transaction([
      // Connect user to friend
      prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: friendId }
          }
        }
      }),
      // Connect friend to user (bidirectional)
      prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            connect: { id: userId }
          }
        }
      })
    ]);
  },

  async getFriends(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: true
      }
    });
    return user?.friends || [];
  },
  /**
   * 
   * @param userId 
   * @param friendId 
   * @returns 
   * 
   * @USE this if you have a userId and a friendId and want to get the balance between them
   * @AKA single-single balance calculation
   */
  async calculateBalanceWithFriend(userId: number, friendId: number) {
    // Find all groups where both users are members
    const sharedGroups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        },
        AND: {
          members: {
            some: {
              userId: friendId
            }
          }
        }
      },
      include: {
        members: {
          where: {
            OR: [
              { userId: userId },
              { userId: friendId }
            ]
          }
        },
        owner: {
          select: {
            id: true
          }
        }
      }
    });

    let balance = 0;

    // Calculate the balance for each shared group
    for (const group of sharedGroups) {
      // Find member records for both users
      const userMember = group.members.find(m => m.userId === userId);
      const friendMember = group.members.find(m => m.userId === friendId);
      
      if (!userMember || !friendMember) continue;

      // If current user is owner, add friend's debt
      if (group.owner.id === userId) {
        balance += friendMember.amountOwed;
      }
      // If friend is owner, subtract user's debt
      else if (group.owner.id === friendId) {
        balance -= userMember.amountOwed;
      }
      // If neither is owner, compare amounts owed or add 0 to balance.
      // this assumes that if neither is owner, they owe each other the same amount.
      else {
        balance += (userMember.amountOwed - friendMember.amountOwed);
      }
    }

    return balance;
  },
  

  /**
   * 
   * @param userId 
   * @returns 
   * 
   * @USE this if you have a userId and want to get all their friends with their balances
   * @AKA single-many balance calculation
   */
  async getFriendsWithBalances(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: true
      }
    });
    
    if (!user) return [];
    
    // calculate balance for each friend
    const friendsWithBalances = await Promise.all(
      user.friends.map(async (friend) => {
        const balance = await this.calculateBalanceWithFriend(userId, friend.id);
        return {
          ...friend,
          balance
        };
      })
    );
    
    return friendsWithBalances;
  }
};