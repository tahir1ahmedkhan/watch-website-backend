import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId: Types.ObjectId): string => {
  const payload = { userId: userId.toString() };
  const secret = process.env.JWT_SECRET!;
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};