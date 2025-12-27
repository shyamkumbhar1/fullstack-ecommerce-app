const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const productService = require('../services/productService');
const cartService = require('../services/cartService');

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    // Get order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (order.paymentMethod !== 'RAZORPAY') {
      return res.status(400).json({
        success: false,
        message: 'Order is not for online payment'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await paymentService.createRazorpayOrder(
      order.totalPrice,
      'INR',
      `receipt_${order._id}`
    );

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const isValid = paymentService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if already paid
    const wasAlreadyPaid = order.isPaid;

    // Update order with payment details
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = 'completed';
    order.status = 'processing'; // Move to processing after payment

    // Update stock and clear cart for Razorpay orders (only on first payment verification)
    if (order.paymentMethod === 'RAZORPAY' && !wasAlreadyPaid) {
      for (const item of order.items) {
        await productService.updateStock(item.product.toString(), item.quantity, 'decrease');
      }

      // Clear cart
      await cartService.clearCart(req.user._id);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync order from Razorpay
// @route   POST /api/payment/sync-order
// @access  Private/Admin
exports.syncOrderFromRazorpay = async (req, res, next) => {
  try {
    const { razorpayOrderId } = req.body;
    
    if (!razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay Order ID is required'
      });
    }

    // Fetch order from Razorpay
    const syncData = await paymentService.syncOrderFromRazorpay(razorpayOrderId);
    const razorpayOrder = syncData.razorpayOrder;
    const payments = syncData.payments;

    // Find local order by razorpayOrderId
    const localOrder = await Order.findOne({ razorpayOrderId });

    if (!localOrder) {
      return res.status(404).json({
        success: false,
        message: 'Local order not found for this Razorpay order'
      });
    }

    // Update based on Razorpay order status
    if (payments.length > 0) {
      const latestPayment = payments[0]; // Most recent payment
      
      // Map Razorpay status to local status
      if (latestPayment.status === 'captured') {
        localOrder.paymentStatus = 'completed';
        localOrder.isPaid = true;
        if (latestPayment.captured_at) {
          localOrder.paidAt = new Date(latestPayment.captured_at * 1000);
        } else {
          localOrder.paidAt = new Date();
        }
        localOrder.razorpayPaymentId = latestPayment.id;
        if (localOrder.status === 'pending') {
          localOrder.status = 'processing';
        }
      } else if (latestPayment.status === 'failed') {
        localOrder.paymentStatus = 'failed';
        localOrder.isPaid = false;
        if (!localOrder.razorpayPaymentId) {
          localOrder.razorpayPaymentId = latestPayment.id;
        }
      } else if (latestPayment.status === 'refunded') {
        localOrder.paymentStatus = 'refunded';
      }
    } else {
      // No payments yet - order is created but not paid
      if (razorpayOrder.status === 'created') {
        localOrder.paymentStatus = 'pending';
        localOrder.isPaid = false;
      }
    }

    await localOrder.save();

    res.status(200).json({
      success: true,
      message: 'Order synced successfully',
      data: {
        localOrder,
        razorpayOrder,
        payments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Razorpay webhook
// @route   POST /api/payment/webhook
// @access  Public (Razorpay will call this)
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Log webhook received
    console.log('[WEBHOOK] Received webhook at:', new Date().toISOString());
    
    // Verify webhook signature
    const crypto = require('crypto');
    
    // req.body is a Buffer from express.raw(), convert to string
    const body = req.body.toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[WEBHOOK] Invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Parse the body to JSON for accessing data
    const webhookData = JSON.parse(body);
    const event = webhookData.event;
    const payment = webhookData.payload.payment.entity;

    console.log('[WEBHOOK] Event:', event);
    console.log('[WEBHOOK] Payment ID:', payment.id);
    console.log('[WEBHOOK] Order ID:', payment.order_id);

    // Handle different events
    switch (event) {
      case 'payment.captured':
        console.log('[WEBHOOK] Processing payment.captured');
        const capturedResult = await Order.findOneAndUpdate(
          { razorpayPaymentId: payment.id },
          {
            isPaid: true,
            paidAt: new Date(),
            paymentStatus: 'completed',
            status: 'processing'
          },
          { new: true }
        );
        console.log('[WEBHOOK] Order updated:', capturedResult ? 'Success' : 'Not found');
        if (capturedResult) {
          console.log('[WEBHOOK] Updated Order ID:', capturedResult._id);
        }
        break;

      case 'payment.failed':
        console.log('[WEBHOOK] Processing payment.failed');
        const failedResult = await Order.findOneAndUpdate(
          { razorpayPaymentId: payment.id },
          {
            paymentStatus: 'failed'
          },
          { new: true }
        );
        console.log('[WEBHOOK] Order updated:', failedResult ? 'Success' : 'Not found');
        if (failedResult) {
          console.log('[WEBHOOK] Updated Order ID:', failedResult._id);
        }
        break;

      case 'payment.refunded':
        console.log('[WEBHOOK] Processing payment.refunded');
        const refundedResult = await Order.findOneAndUpdate(
          { razorpayPaymentId: payment.id },
          {
            paymentStatus: 'refunded'
          },
          { new: true }
        );
        console.log('[WEBHOOK] Order updated:', refundedResult ? 'Success' : 'Not found');
        if (refundedResult) {
          console.log('[WEBHOOK] Updated Order ID:', refundedResult._id);
        }
        break;
    }

    console.log('[WEBHOOK] Webhook processed successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

