const {
  createBrand,
  updateBrandById,
  getBrandById,
  getAllBrands,
  deleteBrandById,
} = require("../controller/brand.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new brand
 * @route   POST /api/v1/brand
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createBrand);

/**
 * @decs    Update brand by id
 * @route   PUT /api/v1/brand/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateBrandById);

/**
 * @decs    Get brand by id
 * @route   GET /api/v1/brand/:id
 * @access  Public
 */
router.get("/:id", getBrandById);

/**
 * @decs    Get all brands
 * @route   GET /api/v1/brand
 * @access  Public
 */
router.get("/", getAllBrands);

/**
 * @decs    Delete brand by id
 * @route   DELETE /api/v1/brand/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteBrandById);

module.exports = router;
