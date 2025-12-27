const User = require('../models/User');
const Cart = require('../models/Cart');
const AppError = require('../utils/AppError');
const emailService = require('./emailService');

// Get all users
exports.getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users;
};

// Get user by ID
exports.getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// Create user (admin only)
exports.createUser = async (userData) => {
  const { name, email, password, role = 'user', phone, address } = userData;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address
  });

  // Send welcome email (non-blocking)
  emailService.sendWelcomeEmail(user.email, user.name)
    .catch(err => {
      console.error('❌ [ADMIN CREATE USER] Failed to send welcome email:', err);
    });

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

// Delete user by ID
exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deleting admin users (optional - for safety)
  if (user.role === 'admin') {
    throw new AppError('Cannot delete admin user', 403);
  }

  // Delete user's cart (if exists)
  await Cart.findOneAndDelete({ user: userId });

  // Delete user
  await User.findByIdAndDelete(userId);
  
  return { message: 'User deleted successfully' };
};

