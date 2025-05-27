import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database setup...');
    
    const saltRounds = 10;
    const password = await bcrypt.hash('password123', saltRounds); 
    
    const users = [
      {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password,
        bio: 'I am a test user',
        avatarUrl: null
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password,
        bio: 'Hi, I am Jane',
        avatarUrl: null
      },
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password,
        bio: 'Hello, I am John',
        avatarUrl: null
      },
      {
        name: 'Bob Johnson',
        username: 'bjohnson',
        email: 'bob@example.com',
        password,
        bio: 'Hey there, I am Bob',
        avatarUrl: null
      }
    ];
    
    try {
      console.log('Setting up database schema...');
      
      console.log('Creating users...');
      for (const userData of users) {
        await prisma.user.create({
          data: userData
        });
      }
      
      // Set up friendships
      console.log('Setting up friendships...');
      const user1 = await prisma.user.findUnique({ where: { username: 'testuser' } });
      const user2 = await prisma.user.findUnique({ where: { username: 'janesmith' } });
      const user3 = await prisma.user.findUnique({ where: { username: 'johndoe' } });
      
      if (user1 && user2) {
        await prisma.user.update({
          where: { id: user1.id },
          data: {
            friends: {
              connect: { id: user2.id }
            }
          }
        });
        
        await prisma.user.update({
          where: { id: user2.id },
          data: {
            friends: {
              connect: { id: user1.id }
            }
          }
        });
      }
      
      if (user1 && user3) {
        await prisma.user.update({
          where: { id: user1.id },
          data: {
            friends: {
              connect: { id: user3.id }
            }
          }
        });
        
        await prisma.user.update({
          where: { id: user3.id },
          data: {
            friends: {
              connect: { id: user1.id }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();