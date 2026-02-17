import { Request, Response } from 'express';
import Admin from '../models/Admin';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { generateToken } from '../utils/jwt';

interface AuthRequest extends Request {
  user?: any;
}

// Admin Authentication
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('=== Admin Login Debug ===');
    console.log('Request body:', req.body);
    console.log('Email:', email);
    console.log('Email type:', typeof email);
    console.log('Email toLowerCase:', email?.toLowerCase());
    console.log('Password length:', password?.length);

    // Try to find admin with different queries
    const admin1 = await Admin.findOne({ email: email });
    console.log('Query with original email:', admin1 ? 'Found' : 'Not found');
    
    const admin2 = await Admin.findOne({ email: email?.toLowerCase() });
    console.log('Query with lowercase email:', admin2 ? 'Found' : 'Not found');
    
    const admin3 = await Admin.findOne({ email: email, isActive: true });
    console.log('Query with isActive:', admin3 ? 'Found' : 'Not found');
    
    // Use the admin that was found
    const admin = admin1 || admin2 || admin3;
    
    if (!admin) {
      console.log('❌ No admin found');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }
    
    console.log('✅ Admin found:', admin.email);

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.user?.id).select('-password');
    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { admin }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Dashboard Statistics
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      topProducts
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.find()
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name price')
        .sort({ createdAt: -1 })
        .limit(10),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.product', 
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }},
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        { $lookup: { 
          from: 'products', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'product' 
        }},
        { $unwind: '$product' }
      ])
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          ordersByStatus: {
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders
          }
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Users
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Orders
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create Admin (Super Admin only)
export const createAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
      return;
    }

    const admin = new Admin({
      email,
      password,
      firstName,
      lastName,
      role: role || 'admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};