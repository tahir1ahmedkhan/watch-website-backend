import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  movement: {
    type: String,
    required: true,
    trim: true
  },
  caseMaterial: {
    type: String,
    required: true,
    trim: true
  },
  caseSize: {
    type: String,
    required: true,
    trim: true
  },
  waterResistance: {
    type: String,
    required: true,
    trim: true
  },
  warranty: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);