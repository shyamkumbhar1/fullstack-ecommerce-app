/**
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {string} image - Product image URL
 * @property {number} stock - Stock quantity
 * @property {boolean} isActive - Whether product is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} CreateProductRequest
 * @property {string} name - Product name (required, min: 2)
 * @property {string} description - Product description (required)
 * @property {number} price - Product price (required, min: 0)
 * @property {number} stock - Stock quantity (required, min: 0)
 * @property {File} [image] - Product image file
 */

/**
 * @typedef {Object} UpdateProductRequest
 * @property {string} [name] - Product name
 * @property {string} [description] - Product description
 * @property {number} [price] - Product price
 * @property {number} [stock] - Stock quantity
 * @property {File} [image] - Product image file
 */

module.exports = {};

