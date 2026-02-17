import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface AuthRequest extends Request {
  admin?: any;
  user?: any;
}

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const admin = await Admin.findById(decoded.userId).select('-password');

    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or admin account deactivated.'
      });
      return;
    }

    req.admin = admin;
    req.user = admin; // For compatibility with existing middleware
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.admin?.role !== 'super-admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
    return;
  }
  next();
};