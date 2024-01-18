const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  getMe,
  updateUserById,
  updateMe,
  refreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyUser,
  loginAdmin,
  getWishlist,
  saveAddress,
  addToWishList,
} = require("../controller/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
router.post("/register", createUser);

/**
 * @desc    Verify user
 * @route   GET /api/v1/user/verify/:verifyToken
 * @access  Public
 */
router.get("/verify/:verifyToken", verifyUser);

/**
 * @desc    Login user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @desc    Login admin
 * @route   POST /api/v1/user/admin/login
 * @access  Public
 * @note    This route is for admin login
 */
router.post("/admin/login", loginAdmin);

/**
 * @desc    Refresh token
 * @route   POST /api/v1/user/refresh-token
 * @access  Public
 */
router.post("/refresh-token", refreshToken);

/**
 * @desc    Update password
 * @route   PUT /api/v1/user/update-password
 * @access  Private/User & Admin
 */
router.put("/update-password", authMiddleware, updatePassword);

/**
 * @desc    Forgot password
 * @route   POST /api/v1/user/forgot-password
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @desc    Reset password
 * @route   PUT /api/v1/user/reset-password/:resetToken
 * @access  Public
 * @note    This route is for resetting password
 */
router.put("/reset-password/:resetToken", resetPassword);

/**
 * @desc    Logout user
 * @route   POST /api/v1/user/logout
 * @access  Private/User & Admin
 */
router.post("/logout", logoutUser);

/**
 * @desc    Update current user
 * @route   PUT /api/v1/user/me
 * @access  Private/User & Admin
 * @note    This route is for updating the current user
 */
router.put("/me", authMiddleware, updateMe);

/**
 * @desc    Save user address
 * @route   PUT /api/v1/user/address
 * @access  Private/User & Admin
 */
router.put("/address", authMiddleware, saveAddress);

/**
 * @desc    Add to wishlist
 * @route   PUT /api/v1/user/wishlist
 * @access  Private/User & Admin
 */
router.put("/wishlist", authMiddleware, addToWishList);

/**
 * @desc    Update user by id
 * @route   PUT /api/v1/user/:id
 * @access  Private/User & Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateUserById);

/**
 * @desc    Get all users
 * @route   GET /api/v1/user
 * @access  Private/Admin
 */
router.get("/users", authMiddleware, isAdmin, getUsers);

/**
 * @desc    Get current user
 * @route   GET /api/v1/user/me
 * @access  Private/User & Admin
 */
router.get("/me", authMiddleware, getMe);

/**
 * @desc    Get wishlist of current user
 * @route   GET /api/v1/user/wishlist
 * @access  Private/User & Admin
 */
router.get("/wishlist", authMiddleware, getWishlist);

/**
 * @desc    Get user by id
 * @route   GET /api/v1/user/:id
 * @access  Private/Admin
 */
router.get("/:id", authMiddleware, isAdmin, getUserById);

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/user/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
