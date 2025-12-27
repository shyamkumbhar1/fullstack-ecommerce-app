const Order = require('../models/Order');
const Cart = require('../models/Cart');
const productService = require('./productService');
const cartService = require('./cartService');
const AppError = require('../utils/AppError');

// Create order
exports.createOrder = async (userId, shippingAddress, paymentMethod = 'COD') => {
  // Get user cart
  const cart = await cartService.getUserCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Check stock for all items
  for (const item of cart.items) {
    await productService.checkStock(item.product._id, item.quantity);
  }

  // Calculate prices
  const items = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.price
  }));

  const itemsPrice = cart.total;
  const shippingPrice = parseFloat(process.env.SHIPPING_PRICE) || 20;
  const taxPrice = 0; // No tax for now
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create order
  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    paymentMethod: paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending'
  });

  // For COD: Update stock and clear cart immediately
  // For Razorpay: Stock will be updated after payment verification
  if (paymentMethod === 'COD') {
    // Update stock
    for (const item of cart.items) {
      await productService.updateStock(item.product._id, item.quantity, 'decrease');
    }

    // Clear cart
    await cartService.clearCart(userId);
    
    // Mark as processing for COD
    order.status = 'processing';
    await order.save();
  }

  return await Order.findById(order._id).populate('items.product').populate('user', 'name email');
};

// Get user orders
exports.getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('items.product')
    .sort({ createdAt: -1 });

  return orders;
};

// Get order by ID
exports.getOrderById = async (orderId, userId = null) => {
  const query = { _id: orderId };
  if (userId) {
    query.user = userId;
  }

  const order = await Order.findOne(query)
    .populate('items.product')
    .populate('user', 'name email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

// Get all orders (admin)
exports.getAllOrders = async () => {
  const orders = await Order.find()
    .populate('items.product')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return orders;
};

// Update order status
exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.status = status;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();

  return await Order.findById(order._id)
    .populate('items.product')
    .populate('user', 'name email');
};

