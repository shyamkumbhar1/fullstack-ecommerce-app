require('../../setup');
const productService = require('../../../src/services/productService');
const Product = require('../../../src/models/Product');
const AppError = require('../../../src/utils/AppError');

describe('Product Service Unit Tests', () => {
  describe('getAllProducts', () => {
    it('should return all active products', async () => {
      await Product.create([
        { name: 'Product 1', description: 'Desc', price: 100, stock: 10, isActive: true, image: '' },
        { name: 'Product 2', description: 'Desc', price: 200, stock: 20, isActive: true, image: '' },
        { name: 'Product 3', description: 'Desc', price: 300, stock: 30, isActive: false, image: '' }
      ]);

      const products = await productService.getAllProducts({ isActive: true });
      expect(products).toHaveLength(2);
      expect(products.every(p => p.isActive === true)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('should return product by ID', async () => {
      const product = await Product.create({
        name: 'Test Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });

      const result = await productService.getProductById(product._id);
      expect(result.name).toBe('Test Product');
    });

    it('should throw error if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await expect(
        productService.getProductById(fakeId)
      ).rejects.toThrow(AppError);
    });
  });

  describe('createProduct', () => {
    it('should create new product', async () => {
      const productData = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        stock: 10,
        image: ''
      };

      const result = await productService.createProduct(productData);
      expect(result.name).toBe(productData.name);
      expect(result.price).toBe(productData.price);
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const product = await Product.create({
        name: 'Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });

      const result = await productService.updateProduct(product._id, {
        name: 'Updated Product',
        price: 200
      });

      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(200);
    });

    it('should throw error if product not found', async () => {
      const fakeId = require('mongoose').Types.ObjectId();
      await expect(
        productService.updateProduct(fakeId, { name: 'Updated' })
      ).rejects.toThrow(AppError);
    });
  });

  describe('checkStock', () => {
    it('should return true if stock available', async () => {
      const product = await Product.create({
        name: 'Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });

      const result = await productService.checkStock(product._id, 5);
      expect(result).toBe(true);
    });

    it('should throw error if insufficient stock', async () => {
      const product = await Product.create({
        name: 'Product',
        description: 'Desc',
        price: 100,
        stock: 10,
        image: ''
      });

      await expect(
        productService.checkStock(product._id, 15)
      ).rejects.toThrow(AppError);
    });
  });
});

