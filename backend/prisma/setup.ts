import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database setup...');
    
    const saltRounds = 10;
    const password = await bcrypt.hash('password123', saltRounds); // simple pwd for testing
    
    const users = [
      {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password
      },
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password
      },
      {
        name: 'Bob Johnson',
        username: 'bjohnson',
        email: 'bob@example.com',
        password
      }
    ];
    
    for (const userData of users) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
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