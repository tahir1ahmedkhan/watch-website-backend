import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import orderRoutes from './orders';
import adminRoutes from './admin';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Watch Store API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;