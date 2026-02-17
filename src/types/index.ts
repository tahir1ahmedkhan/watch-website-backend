import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAddress {
  _id?: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Product Types
export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
  movement: string;
  caseMaterial: string;
  caseSize: string;
  waterResistance: string;
  warranty: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface IOrderItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

// Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: Omit<IAddress, '_id' | 'isDefault'>;
  billingAddress?: Omit<IAddress, '_id' | 'isDefault'>;
  paymentMethod: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}