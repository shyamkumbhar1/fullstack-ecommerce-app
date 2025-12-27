/**
 * @typedef {Object} OrderItem
 * @property {string} product - Product ID
 * @property {number} quantity - Item quantity
 * @property {number} price - Item price
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID
 * @property {string} user - User ID
 * @property {OrderItem[]} items - Order items
 * @property {Address} shippingAddress - Shipping address
 * @property {string} paymentMethod - Payment method (COD|RAZORPAY)
 * @property {string} [razorpayOrderId] - Razorpay order ID
 * @property {string} [razorpayPaymentId] - Razorpay payment ID
 * @property {string} [razorpaySignature] - Razorpay signature
 * @property {string} paymentStatus - Payment status (pending|completed|failed|refunded)
 * @property {number} totalPrice - Total price
 * @property {number} taxPrice - Tax price
 * @property {number} shippingPrice - Shipping price
 * @property {string} status - Order status (pending|processing|shipped|delivered)
 * @property {boolean} isPaid - Whether order is paid
 * @property {Date} [paidAt] - Payment date
 * @property {boolean} isDelivered - Whether order is delivered
 * @property {Date} [deliveredAt] - Delivery date
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} CreateOrderRequest
 * @property {Address} shippingAddress - Shipping address (required)
 * @property {string} [paymentMethod] - Payment method (COD|RAZORPAY, default: COD)
 */

/**
 * @typedef {Object} Address
 * @property {string} street - Street address (required)
 * @property {string} city - City (required)
 * @property {string} state - State (required)
 * @property {string} zipCode - Zip code (required)
 * @property {string} country - Country (required)
 */

/**
 * @typedef {Object} UpdateOrderStatusRequest
 * @property {string} status - Order status (required, pending|processing|shipped|delivered)
 */

module.exports = {};

