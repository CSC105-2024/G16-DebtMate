import bcrypt from 'bcrypt';
import db from '../config/db.config';
import dotenv from 'dotenv';

dotenv.config();

const DB_MODE = process.env.DB_MODE || 'memory';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

// In-memory storage only used in memory mode
const users: User[] = [];
let nextId = 1;

// Helper functions for PostgreSQL operations
const pgUserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },
  
  async findByName(username: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    return result.rows.length > 0;
  },
  
  async exists(username: string, email: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    return result.rows.length > 0;
  },
  
  async create(username: string, email: string, password: string): Promise<Omit<User, 'password'>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await db.query(
      'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, created_at',
      [username, username, email, hashedPassword]
    );
    
    return result.rows[0];
  },
  
  async findByUsernamePattern(pattern: string, limit: number = 5): Promise<User[]> {
    const result = await db.query(
      'SELECT id, name, username, email, created_at FROM users WHERE username ILIKE $1 LIMIT $2',
      [`${pattern}%`, limit]
    );
    return result.rows;
  }
};

// In-memory user model implementation
const memoryUserModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    return users.find(user => user.email === email) || null;
  },
  
  findByName: async (username: string): Promise<boolean> => {
    return users.some(user => user.username === username);
  },

  exists: async (username: string, email: string): Promise<boolean> => {
    return users.some(user => user.username === username || user.email === email);
  },
  
  create: async (username: string, email: string, password: string): Promise<Omit<User, 'password'>> => {
    // Hash password 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser: User = {
      id: nextId++,
      name: username,
      username,
      email,
      password: hashedPassword,
      created_at: new Date()
    };
    
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  findByUsernamePattern: async (pattern: string, limit: number = 5): Promise<User[]> => {
    return users
      .filter(user => user.username.toLowerCase().startsWith(pattern.toLowerCase()))
      .slice(0, limit)
      .map(({ password, ...user }) => user as User);
  }
};

// Common operations that work with both implementations
const commonUserModel = {
  validatePassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

// Choose the appropriate implementation based on DB_MODE
const UserModel = DB_MODE === 'postgres' 
  ? { ...pgUserModel, ...commonUserModel }
  : { ...memoryUserModel, ...commonUserModel };

export { User, UserModel };