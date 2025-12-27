const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Generate JWT token for testing
exports.generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'test_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Create test user
exports.createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    ...userData,
  };
  return await User.create(defaultUser);
};

// Create test admin user
exports.createTestAdmin = async () => {
  return await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });
};

