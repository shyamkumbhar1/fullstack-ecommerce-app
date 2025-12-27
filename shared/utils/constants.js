/**
 * Shared Constants
 * Used across all backend stacks
 */

// Order Status
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
};

const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment Methods
const PAYMENT_METHODS = {
  COD: 'COD',
  RAZORPAY: 'RAZORPAY'
};

// File Upload Limits
const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
};

// Validation Rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PRICE_MIN: 0,
  STOCK_MIN: 0,
  QUANTITY_MIN: 1
};

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  USER_ROLES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  FILE_UPLOAD_LIMITS,
  VALIDATION_RULES
};

