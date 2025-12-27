/**
 * @typedef {Object} CartItem
 * @property {string} product - Product ID
 * @property {number} quantity - Item quantity
 * @property {number} price - Item price
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - Cart ID
 * @property {string} user - User ID
 * @property {CartItem[]} items - Cart items
 * @property {number} total - Cart total
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} AddToCartRequest
 * @property {string} productId - Product ID (required, MongoDB ObjectId)
 * @property {number} [quantity] - Quantity (optional, min: 1, default: 1)
 */

/**
 * @typedef {Object} UpdateCartItemRequest
 * @property {number} quantity - Quantity (required, min: 1)
 */

module.exports = {};

