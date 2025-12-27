require('../setup');
const request = require('supertest');
const app = require('../../src/server');
const Product = require('../../src/models/Product');
const Cart = require('../../src/models/Cart');
const { createTestUser, generateToken } = require('../helpers/testHelpers');

describe('Cart API Integration Tests', () => {
  let user, token, product;

  beforeEach(async () => {
    user = await createTestUser();
    token = generateToken(user._id);
    product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isActive: true,
      image: ''
    });
  });

  describe('GET /api/cart', () => {
    it('should get user cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data.items).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/cart')
        .expect(401);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 2
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].quantity).toBe(2);
    });

    it('should update quantity if item already in cart', async () => {
      // Add item first time
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 2
        });

      // Add same item again
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 3
        })
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].quantity).toBe(5); // 2 + 3
    });

    it('should return 400 if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: fakeId,
          quantity: 1
        })
        .expect(400);
    });

    it('should return 400 if insufficient stock', async () => {
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 100 // More than available stock
        })
        .expect(400);
    });
  });

  describe('PUT /api/cart/:id', () => {
    let cart, itemId;

    beforeEach(async () => {
      const cartResponse = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 2
        });
      cart = cartResponse.body.data;
      itemId = cart.items[0]._id;
    });

    it('should update cart item quantity', async () => {
      const response = await request(app)
        .put(`/api/cart/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 5
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items[0].quantity).toBe(5);
    });

    it('should return 404 if item not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .put(`/api/cart/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 5
        })
        .expect(404);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    let cart, itemId;

    beforeEach(async () => {
      const cartResponse = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
          quantity: 2
        });
      cart = cartResponse.body.data;
      itemId = cart.items[0]._id;
    });

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete(`/api/cart/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(0);
    });

    it('should return 404 if item not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .delete(`/api/cart/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

