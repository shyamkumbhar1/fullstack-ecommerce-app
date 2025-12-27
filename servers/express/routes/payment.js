const express = require('express');
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
  syncOrderFromRazorpay
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Webhook route (no auth - Razorpay calls this)
// Important: Use express.raw() for webhook to get raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/sync-order', protect, authorize('admin'), syncOrderFromRazorpay);

module.exports = router;

