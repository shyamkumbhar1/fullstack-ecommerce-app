const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// Get all products
exports.getAllProducts = async (filters = {}) => {
  const { isActive = true } = filters;
  
  const products = await Product.find({ isActive })
    .sort({ createdAt: -1 });

  return products;
};

// Get product by ID
exports.getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

// Create product
exports.createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

// Update product
exports.updateProduct = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

// Delete product (soft delete)
exports.deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

// Check product stock
exports.checkStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);
  }

  return true;
};

// Update stock
exports.updateStock = async (productId, quantity, operation = 'decrease') => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (operation === 'decrease') {
    product.stock -= quantity;
  } else if (operation === 'increase') {
    product.stock += quantity;
  }

  await product.save();
  return product;
};

