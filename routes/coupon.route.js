const {
  createCoupon,
  getAllCoupons,
  updateCouponById,
  deleteCouponById,
} = require("../controller/coupon.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new coupon
 * @route   POST /api/v1/coupon
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createCoupon);

/**
 * @desc    Update coupon by id
 * @route   PUT /api/v1/coupon/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateCouponById);

/**
 * @desc    Get all coupons
 * @route   GET /api/v1/coupon
 * @access  Private/Admin
 */
router.get("/", authMiddleware, isAdmin, getAllCoupons);

/**
 * @desc    Delete coupon by id
 * @route   DELETE /api/v1/coupon/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteCouponById);

module.exports = router;
