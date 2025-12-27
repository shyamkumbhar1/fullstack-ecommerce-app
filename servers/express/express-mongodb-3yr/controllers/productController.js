const { validationResult } = require('express-validator');
const productService = require('../services/productService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// 2021 Pattern: Mix of async/await and promises
exports.getProducts = async (req, res, next) => {
  try {
    // Using async/await (modern pattern)
    const products = await productService.getAllProducts({ isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
// 2021 Pattern: Using promises (older style mixed with new)
exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  productService.createProduct(req.body, req.file)
    .then(product => {
      res.status(201).json({
        success: true,
        data: product
      });
    })
    .catch(err => next(err));
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.file);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (req, res, next) => {
  productService.deleteProduct(req.params.id)
    .then(() => {
      res.status(200).json({
        success: true,
        data: {}
      });
    })
    .catch(err => next(err));
};
