require('../setup');
const request = require('supertest');
const app = require('../../server');
const { createTestUser, createTestAdmin, generateToken } = require('../helpers/testHelpers');

describe('Users API Integration Tests', () => {
  let admin, adminToken, user;

  beforeEach(async () => {
    admin = await createTestAdmin();
    adminToken = generateToken(admin._id);
    user = await createTestUser();
  });

  describe('GET /api/users', () => {
    it('should get all users (admin)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should return 403 if not admin', async () => {
      const userToken = generateToken(user._id);
      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get single user (admin)', async () => {
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(user._id.toString());
    });

    it('should return 404 if user not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 403 if not admin', async () => {
      const userToken = generateToken(user._id);
      await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});

