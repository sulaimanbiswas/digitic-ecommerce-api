const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  getAllProducts,
} = require("../controller/product.controller");

/**
 * @desc    Create a new product
 * @route   POST /api/v1/product
 * @access  Private/Admin
 */
router.post("/", createProduct);

/**
 * @desc    Get a single product by id
 * @route   GET /api/v1/product/:id
 * @access  Public
 */
router.get("/:id", getProductById);

/**
 * @desc    Get all products
 * @route   GET /api/v1/product
 * @access  Public
 */
router.get("/", getAllProducts);

module.exports = router;
