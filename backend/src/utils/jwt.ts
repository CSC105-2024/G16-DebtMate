/**
 * jwt utility functions for generating and verifying authentication tokens.
 * uses the JWT_SECRET from environment variables to sign tokens.
 * provides methods used by auth controller and auth middleware.
 * tokens contain user ID and have configurable expiration time.
 */

import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ms from 'ms';

// setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// get JWT configuration from environment
const JWT_SECRET: Secret = process.env.JWT_SECRET || '31415926';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not found in environment variables. Using default secret for development.');
}

// how long the token should be valid
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as ms.StringValue;

// token payload structure
interface UserPayload extends JwtPayload {
  userId: number;
}

/**
 * Generates a JWT token for authentication
 * @param userId - User ID to encode in the token
 * @returns signed JWT token string
 */
export const generateToken = (userId: number): string => {
  const payload: UserPayload = { userId };
  const options: SignOptions = { 
    expiresIn: JWT_EXPIRES_IN 
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns decoded token payload with user ID
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};