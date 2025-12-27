require('../setup');
const request = require('supertest');
const app = require('../../src/server');
const Product = require('../../src/models/Product');
const Cart = require('../../src/models/Cart');
const Order = require('../../src/models/Order');
const { createTestUser, createTestAdmin, generateToken } = require('../helpers/testHelpers');

describe('Orders API Integration Tests', () => {
  let user, userToken, admin, adminToken, product;

  beforeEach(async () => {
    user = await createTestUser();
    userToken = generateToken(user._id);
    admin = await createTestAdmin();
    adminToken = generateToken(admin._id);
    
    product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isActive: true,
      image: ''
    });

    // Add item to cart
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId: product._id,
        quantity: 2
      });
  });

  describe('POST /api/orders', () => {
    const shippingAddress = {
      street: '123 Main St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'India'
    };

    it('should create order (COD)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'COD'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentMethod).toBe('COD');
      expect(response.body.data.status).toBe('processing');
    });

    it('should create order (Razorpay)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'RAZORPAY'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentMethod).toBe('RAZORPAY');
      expect(response.body.data.status).toBe('pending');
    });

    it('should return 400 if cart empty', async () => {
      // Clear cart
      const cart = await Cart.findOne({ user: user._id });
      cart.items = [];
      await cart.save();

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'COD'
        })
        .expect(400);
    });

    it('should return 400 if validation fails', async () => {
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress: {
            street: '', // Missing required field
            city: 'Test'
          },
          paymentMethod: 'COD'
        })
        .expect(400);
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      const shippingAddress = {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India'
      };

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'COD'
        });
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should return empty if no orders', async () => {
      const newUser = await createTestUser({ email: 'newuser@test.com' });
      const newToken = generateToken(newUser._id);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /api/orders/:id', () => {
    let order;

    beforeEach(async () => {
      const shippingAddress = {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'COD'
        });
      order = response.body.data;
    });

    it('should get single order', async () => {
      const response = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(order._id.toString());
    });

    it('should return 404 if order not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('GET /api/orders/all', () => {
    it('should get all orders (admin)', async () => {
      const response = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 403 if not admin', async () => {
      await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    let order;

    beforeEach(async () => {
      const shippingAddress = {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress,
          paymentMethod: 'COD'
        });
      order = response.body.data;
    });

    it('should update order status (admin)', async () => {
      const response = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'shipped'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('shipped');
    });

    it('should return 403 if not admin', async () => {
      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'shipped'
        })
        .expect(403);
    });
  });
});

