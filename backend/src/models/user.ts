/**
 * User model for managing user data and authentication.
 * Uses Prisma client for database operations.
 */

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserModel = {
  // Find user by ID
  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  },
  
  // Find user by email
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  // Find user by username
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  },
  
  // Check if a user exists by username or email
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
  
  // Create a new user
  async create(name: string, email: string, username: string, password: string) {
    // Hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the user in the database
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
  
  // Validate user password
  async validatePassword(user: any, password: string) {
    return bcrypt.compare(password, user.password);
  },
  
  // Search for users by name, username, or email
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
  }
};