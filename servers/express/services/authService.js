const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const emailService = require('./emailService');
const logger = require('../utils/logger');

// Register user
exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    logger.warn('REGISTRATION', 'User already exists', { email });
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  logger.success('REGISTRATION', 'User created', { email, userId: user._id });

  // Send welcome email (non-blocking - don't wait for email)
  emailService.sendWelcomeEmail(user.email, user.name)
    .then(result => {
      if (result.success) {
        logger.success('REGISTRATION', 'Welcome email sent', { email: user.email });
      } else {
        logger.error('REGISTRATION', 'Welcome email failed', result.error);
      }
    })
    .catch(err => {
      logger.error('REGISTRATION', 'Email send error', err);
      // Email failure shouldn't break registration
    });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

// Login user
exports.loginUser = async (email, password) => {
  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

// Get user by ID
exports.getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

