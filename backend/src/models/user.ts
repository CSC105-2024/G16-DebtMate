// User model definition
import pool from '../config/db.config';
import bcrypt from 'bcrypt';
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

const UserModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },
  
  exists: async (username: string, email: string): Promise<boolean> => {
    try {
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1 OR email = $2)',
        [username, email]
      );
      return result.rows[0].exists;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  },
  
  create: async (username: string, email: string, password: string): Promise<Omit<User, 'password'>> => {
    try {
      // Hash password 
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hashedPassword]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  validatePassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export { User, UserModel };