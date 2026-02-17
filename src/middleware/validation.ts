import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[\+]?[1-9][\d]{9,14}$/)
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping first name is required'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping last name is required'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping street is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping city is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping state is required'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Shipping zip code is required'),
  body('paymentMethod')
    .isIn(['credit-card', 'paypal', 'apple-pay', 'google-pay'])
    .withMessage('Invalid payment method'),
  handleValidationErrors
];

export const validateUpdateOrderStatus = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tracking number cannot be empty'),
  body('notes')
    .optional()
    .trim(),
  handleValidationErrors
];