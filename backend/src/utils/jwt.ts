/**
 * jwt stuff for authentication
 * tokens let us know who's logged in
 */

import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ms from 'ms';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const JWT_SECRET: Secret = process.env.JWT_SECRET || '31415926';


const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as ms.StringValue;

interface UserPayload extends JwtPayload {
  userId: number;
}
export class JWT {
  static generate = (userId: number): string => {
    const payload: UserPayload = { userId };
    const options: SignOptions = { 
      expiresIn: JWT_EXPIRES_IN 
    };
    return jwt.sign(payload, JWT_SECRET, options);
  };

  // checks if a token is legit when someone tries to use it
  static verify = (token: string): UserPayload => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  };
}

// kept these for compatibility with my old code
export const generateToken = JWT.generate;
export const verifyToken = JWT.verify;