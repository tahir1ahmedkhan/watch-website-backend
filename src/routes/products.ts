import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getCategories,
  getBrands,
  getFeaturedProducts
} from '../controllers/productController';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:id', getProductById);

export default router;