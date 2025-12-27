const Cart = require('../models/Cart');
const Product = require('../models/Product');
const productService = require('./productService');
const AppError = require('../utils/AppError');

// Get user cart
exports.getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Add item to cart
exports.addToCart = async (userId, productId, quantity = 1) => {
  // Check product stock
  await productService.checkStock(productId, quantity);

  // Get product details
  const product = await productService.getProductById(productId);

  // Get or create cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    // Check stock again for new quantity
    await productService.checkStock(productId, newQuantity);
    
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  await cart.save();
  return await Cart.findById(cart._id).populate('items.product');
};

// Update cart item quantity
exports.updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new AppError('Item not found in cart', 404);
  }

  // Check stock
  await productService.checkStock(item.product.toString(), quantity);

  item.quantity = quantity;
  await cart.save();

  return await Cart.findById(cart._id).populate('items.product');
};

// Remove item from cart
exports.removeFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  await cart.save();

  return await Cart.findById(cart._id).populate('items.product');
};

// Clear cart
exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();

  return cart;
};

