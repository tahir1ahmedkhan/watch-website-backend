import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { CreateOrderRequest, UpdateOrderStatusRequest, OrderStatus } from '../types';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body as CreateOrderRequest;
    const userId = req.user!._id;

    // Validate and get product details
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
        return;
      }

      if (!product.inStock || product.stockCount < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.image
      });

      // Update product stock
      product.stockCount -= item.quantity;
      if (product.stockCount === 0) {
        product.inStock = false;
      }
      await product.save();
    }

    // Calculate totals
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: { ...shippingAddress, type: 'shipping' },
      billingAddress: billingAddress ? { ...billingAddress, type: 'billing' } : undefined,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      status: OrderStatus.PENDING
    });

    await order.save();
    await order.populate('user', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = { user: userId };
    if (status) filter.status = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.product', 'name image brand category')
      .populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body as UpdateOrderStatusRequest;

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    if (order.status !== OrderStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled'
      });
      return;
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockCount += item.quantity;
        product.inStock = true;
        await product.save();
      }
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Admin functions
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};