/**
 * User model that handles all user-related database operations.
 * Provides methods for finding, creating, and validating users.
 * Uses in-memory storage mode.
 */

import bcrypt from 'bcrypt';
import db from '../config/db.config';
import dotenv from 'dotenv';

dotenv.config();

// User model interface
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string;
  created_at?: Date;
}

// In-memory storage
const users: User[] = [];
let nextId = 1;

// User model implementation
const UserModel = {
  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  // Check if a username exists
  async findByName(username: string): Promise<boolean> {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows.length > 0;
  },
  
  // Check if username or email exists
  async exists(username: string, email: string): Promise<boolean> {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    return result.rows.length > 0;
  },
  
  // Find user by ID
  async findById(id: number): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const { password, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword as User;
  },
  
  // Find user by username and password for authentication
  async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const passwordMatch = await UserModel.validatePassword(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },
  
  // Create a new user
  async create(username: string, email: string, name: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
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
  
  // Find users by username pattern
  async findByUsernamePattern(pattern: string, limit: number = 5): Promise<User[]> {
    return users
      .filter(user => user.username.toLowerCase().startsWith(pattern.toLowerCase()))
      .slice(0, limit)
      .map(({ password, ...user }) => user as User);
  },
  
  // Validate password
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export { User, UserModel };