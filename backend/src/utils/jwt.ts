import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const JWT_SECRET: Secret = process.env.JWT_SECRET || '31415926';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not found in environment variables. Using default secret for development.');
}

const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '7d';

interface UserPayload extends JwtPayload {
  userId: number;
}

export const generateToken = (userId: number): string => {
  const payload: UserPayload = { userId };
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};