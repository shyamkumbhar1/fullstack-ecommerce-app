/**
 * Shared Validation Utilities
 * Common validation functions used across all backend stacks
 */

const { VALIDATION_RULES } = require('./constants');

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }
  
  const trimmed = name.trim();
  if (trimmed.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please provide a valid email' };
  }
  
  return { valid: true };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {Object} Validation result
 */
function validatePrice(price) {
  if (price === undefined || price === null) {
    return { valid: false, error: 'Price is required' };
  }
  
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Price must be a number' };
  }
  
  if (numPrice < VALIDATION_RULES.PRICE_MIN) {
    return { valid: false, error: 'Price must be a positive number' };
  }
  
  return { valid: true };
}

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @returns {Object} Validation result
 */
function validateQuantity(quantity) {
  if (quantity === undefined || quantity === null) {
    return { valid: false, error: 'Quantity is required' };
  }
  
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) {
    return { valid: false, error: 'Quantity must be an integer' };
  }
  
  if (numQuantity < VALIDATION_RULES.QUANTITY_MIN) {
    return { valid: false, error: `Quantity must be at least ${VALIDATION_RULES.QUANTITY_MIN}` };
  }
  
  return { valid: true };
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validatePrice,
  validateQuantity
};

