const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const AppError = require('../utils/AppError');

// Helper to check if Razorpay is configured
const isRazorpayConfigured = () => {
  return razorpay !== null;
};

// Create Razorpay order
exports.createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.', 500);
  }
  
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: currency,
    receipt: receipt,
    payment_capture: 1 // Auto capture payment
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    };
  } catch (error) {
    throw new AppError(`Razorpay order creation failed: ${error.message}`, 500);
  }
};

// Verify payment signature
exports.verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured.', 500);
  }
  
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

// Get payment details
exports.getPaymentDetails = async (paymentId) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured.', 500);
  }
  
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new AppError(`Failed to fetch payment: ${error.message}`, 500);
  }
};

// Refund payment
exports.refundPayment = async (paymentId, amount) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured.', 500);
  }
  
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100 // Amount in paise
    });
    return refund;
  } catch (error) {
    throw new AppError(`Refund failed: ${error.message}`, 500);
  }
};

// Get Razorpay order details
exports.getRazorpayOrder = async (orderId) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured.', 500);
  }
  
  try {
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    throw new AppError(`Failed to fetch Razorpay order: ${error.message}`, 500);
  }
};

// Sync order from Razorpay
exports.syncOrderFromRazorpay = async (razorpayOrderId) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured.', 500);
  }
  
  try {
    const razorpayOrder = await razorpay.orders.fetch(razorpayOrderId);
    
    // Get payments for this order
    const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
    
    return {
      razorpayOrder,
      payments: payments.items || []
    };
  } catch (error) {
    throw new AppError(`Failed to sync order from Razorpay: ${error.message}`, 500);
  }
};

