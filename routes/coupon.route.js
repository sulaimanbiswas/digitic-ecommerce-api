const { createCoupon } = require("../controller/coupon.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new coupon
 * @route   POST /api/v1/coupon
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createCoupon);

module.exports = router;
