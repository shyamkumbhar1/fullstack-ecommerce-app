require('../../setup');
const authService = require('../../../src/services/authService');
const User = require('../../../src/models/User');
const AppError = require('../../../src/utils/AppError');

describe('Auth Service Unit Tests', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.registerUser(userData);

      expect(result).toHaveProperty('token');
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(result.role).toBe('user');

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should throw error if user already exists', async () => {
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      });

      await expect(
        authService.registerUser({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login user with correct credentials', async () => {
      const result = await authService.loginUser('login@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.email).toBe('login@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should throw error with incorrect password', async () => {
      await expect(
        authService.loginUser('login@example.com', 'wrongpassword')
      ).rejects.toThrow(AppError);
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow(AppError);
    });
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'getuser@example.com',
        password: 'password123',
      });

      const result = await authService.getUserById(user._id);

      expect(result).toBeTruthy();
      expect(result.email).toBe('getuser@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await expect(
        authService.getUserById(fakeId)
      ).rejects.toThrow(AppError);
    });
  });
});

