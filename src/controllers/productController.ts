import { Request, Response } from 'express';
import Product from '../models/Product';
import { ApiResponse } from '../types';
import { uploadImage, deleteImage } from '../utils/supabase';

interface AuthRequest extends Request {
  user?: any;
}

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await Product.distinct('brand');
    
    res.json({
      success: true,
      message: 'Brands retrieved successfully',
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    
    const products = await Product.find({ inStock: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Admin: Create Product
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    
    // Handle image upload if file is provided
    if (req.file) {
      try {
        const imageUrl = await uploadImage(req.file);
        productData.image = imageUrl;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // If Supabase upload fails, use a placeholder or return error
        res.status(500).json({
          success: false,
          message: 'Image upload failed. Please check Supabase configuration.',
          error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
        });
        return;
      }
    } else if (!productData.image) {
      // If no file and no image URL provided, require an image
      res.status(400).json({
        success: false,
        message: 'Product image is required'
      });
      return;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Admin: Update Product
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Handle image upload if new file is provided
    if (req.file) {
      try {
        // Delete old image if it exists and is from Supabase
        if (product.image && product.image.includes('supabase')) {
          try {
            await deleteImage(product.image);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if delete fails
          }
        }
        
        // Upload new image
        const imageUrl = await uploadImage(req.file);
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        res.status(500).json({
          success: false,
          message: 'Image upload failed. Please check Supabase configuration.',
          error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
        });
        return;
      }
    }

    // Update product
    Object.assign(product, updateData);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Admin: Delete Product
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Delete image from Supabase if it exists
    if (product.image && product.image.includes('supabase')) {
      try {
        await deleteImage(product.image);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with product deletion even if image delete fails
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Admin: Get All Products (with more details)
export const getAdminProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      brand,
      inStock
    } = req.query;

    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
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
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
