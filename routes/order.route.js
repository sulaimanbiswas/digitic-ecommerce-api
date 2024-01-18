const {
  createOrder,
  getOrder,
  updateOrderStatus,
  getOrderMe,
} = require("../controller/order.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

/**
 * @desc    Create order
 * @route   POST /api/v1/order
 * @access  Private/User & Admin
 * @note    This route is for creating order
 */
router.post("/", authMiddleware, createOrder);

/**
 * @desc    Update order status
 * @route   PUT /api/v1/order/status
 * @access  Private/Admin
 * @note    This route is for updating order status
 */
router.put("/status", authMiddleware, isAdmin, updateOrderStatus);
/**
 * @desc    Get orders current user
 * @route   GET /api/v1/order
 * @access  Private/User & Admin
 * @note    This route is for getting orders current user
 */
router.get("/me", getOrderMe);

/**
 * @desc    Get orders
 * @route   GET /api/v1/order
 * @access  Private/Admin
 * @note    This route is for getting orders
 */
router.get("/", authMiddleware, isAdmin, getOrder);

module.exports = router;
