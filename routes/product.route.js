const express = require("express");
const router = express.Router();
const { createProduct } = require("../controller/product.controller");

/**
 * @desc    Create a new product
 * @route   POST /api/v1/product
 * @access  Private/Admin
 */
router.post("/", createProduct);

module.exports = router;
