const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

/**
 * @desc    Create a new product
 * @route   POST /api/v1/product
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createProduct);

/**
 * @desc    Update a product by id
 * @route   PUT /api/v1/product/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateProduct);

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

/**
 * @desc    Delete a product by id
 * @route   DELETE /api/v1/product/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
