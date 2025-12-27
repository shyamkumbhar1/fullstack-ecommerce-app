require('../setup');
const request = require('supertest');
const app = require('../../src/server');
const Product = require('../../src/models/Product');
const { createTestUser, createTestAdmin, generateToken } = require('../helpers/testHelpers');

describe('Products API Integration Tests', () => {
  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Product 1', description: 'Desc 1', price: 100, stock: 10, isActive: true, image: '' },
        { name: 'Product 2', description: 'Desc 2', price: 200, stock: 20, isActive: true, image: '' },
        { name: 'Product 3', description: 'Desc 3', price: 300, stock: 30, isActive: false, image: '' }
      ]);
    });

    it('should get all active products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2); // Only active products
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array if no products', async () => {
      await Product.deleteMany({});
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        isActive: true,
        image: ''
      });
    });

    it('should get single product', async () => {
      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Product');
      expect(response.body.data._id.toString()).toBe(product._id.toString());
    });

    it('should return 404 if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);
    });
  });

  describe('POST /api/products', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await createTestAdmin();
      adminToken = generateToken(admin._id);
    });

    it('should create product (admin)', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 150,
        stock: 15
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.price).toBe(productData.price);
    });

    it('should return 403 if not admin', async () => {
      const user = await createTestUser();
      const userToken = generateToken(user._id);

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Product',
          description: 'Desc',
          price: 100,
          stock: 10
        })
        .expect(403);
    });

    it('should return 400 if validation fails', async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A', // Too short
          price: -100, // Negative price
          stock: -5 // Negative stock
        })
        .expect(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    let product, adminToken;

    beforeEach(async () => {
      product = await Product.create({
        name: 'Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });
      const admin = await createTestAdmin();
      adminToken = generateToken(admin._id);
    });

    it('should update product (admin)', async () => {
      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Product',
          description: 'Updated Desc',
          price: 200,
          stock: 20
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Product');
      expect(response.body.data.price).toBe(200);
    });

    it('should return 404 if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          description: 'Desc',
          price: 100,
          stock: 10
        })
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let product, adminToken;

    beforeEach(async () => {
      product = await Product.create({
        name: 'Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });
      const admin = await createTestAdmin();
      adminToken = generateToken(admin._id);
    });

    it('should delete product (admin)', async () => {
      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify product is soft deleted
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct.isActive).toBe(false);
    });

    it('should return 404 if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});

