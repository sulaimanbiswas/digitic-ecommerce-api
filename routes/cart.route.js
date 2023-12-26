const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addToCart,
  getCart,
  emptyCart,
  applyCouponToCart,
} = require("../controller/cart.controller");
const router = express.Router();

/**
 * @desc    User cart
 * @route   POST /api/v1/user/cart
 * @access  Private/User & Admin
 */
router.post("/", authMiddleware, addToCart);

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/v1/user/cart/coupon
 * @access  Private/User & Admin
 */
router.post("/coupon", authMiddleware, applyCouponToCart);

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
