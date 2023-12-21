const { createBrand } = require("../controller/brand.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new brand
 * @route   POST /api/v1/brand
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createBrand);

module.exports = router;
