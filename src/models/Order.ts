import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderItem, IAddress, OrderStatus } from '../types';

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { _id: false });

const OrderAddressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['shipping', 'billing'],
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'United States'
  },
  phone: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  shippingAddress: {
    type: OrderAddressSchema,
    required: true
  },
  billingAddress: {
    type: OrderAddressSchema
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit-card', 'paypal', 'apple-pay', 'google-pay']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `WS${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Index for efficient queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);