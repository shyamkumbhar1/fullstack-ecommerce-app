/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} role - User role (user|admin)
 * @property {string} [phone] - User phone number
 * @property {Address} [address] - User address
 * @property {string} [avatar] - User avatar URL
 * @property {boolean} isActive - Whether user is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} Address
 * @property {string} [street] - Street address
 * @property {string} [city] - City
 * @property {string} [state] - State
 * @property {string} [zipCode] - Zip code
 * @property {string} [country] - Country
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} name - User name (required, min: 2)
 * @property {string} email - User email (required, valid email)
 * @property {string} password - User password (required, min: 6)
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email - User email (required)
 * @property {string} password - User password (required)
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Success status
 * @property {string} token - JWT token
 * @property {User} user - User object
 */

module.exports = {};

