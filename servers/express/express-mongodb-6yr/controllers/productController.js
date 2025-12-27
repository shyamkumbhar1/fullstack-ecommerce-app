const { validationResult } = require('express-validator');
const productService = require('../services/productService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// 2018 Pattern: Callback-based
exports.getProducts = function(req, res, next) {
  productService.getAllProducts({ isActive: true }, function(err, products) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = function(req, res, next) {
  productService.getProductById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      data: product
    });
  });
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
// 2018 Pattern: Callback-based with validation
exports.createProduct = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const productData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    image: req.file ? '/uploads/products/' + req.file.filename : ''
  };

  productService.createProduct(productData, req.file, function(err, product) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      success: true,
      data: product
    });
  });
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const productData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock
  };

  if (req.file) {
    productData.image = '/uploads/products/' + req.file.filename;
  }

  productService.updateProduct(req.params.id, productData, req.file, function(err, product) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      data: product
    });
  });
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = function(req, res, next) {
  productService.deleteProduct(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  });
};
