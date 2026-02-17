import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validateOrder, validateUpdateOrderStatus } from '../middleware/validation';

const router = Router();

// Protected user routes
router.post('/', authenticate, validateOrder, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/cancel', authenticate, cancelOrder);

// Admin routes (for now, no admin middleware - you can add it later)
router.get('/', getAllOrders);
router.patch('/:id/status', validateUpdateOrderStatus, updateOrderStatus);

export default router;