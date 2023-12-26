const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addToCart,
  getCart,
  emptyCart,
} = require("../controller/cart.controller");
const router = express.Router();

/**
 * @desc    User cart
 * @route   POST /api/v1/user/cart
 * @access  Private/User & Admin
 */
router.post("/", authMiddleware, addToCart);

/**
 * @desc    Get cart of current user
 * @route   GET /api/v1/user/cart
 * @access  Private/User & Admin
 */
router.get("/", authMiddleware, getCart);

/**
 * @desc    Empty cart of current user
 * @route   DELETE /api/v1/user/cart
 * @access  Private/User & Admin
 */
router.delete("/", authMiddleware, emptyCart);

module.exports = router;
