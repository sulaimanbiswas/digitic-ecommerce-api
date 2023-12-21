const {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
  getAllCategories,
} = require("../controller/blogCategory.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new category
 * @route   POST /api/v1/category
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createCategory);

/**
 * @desc    Update category by id
 * @route   PUT /api/v1/category/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateCategoryById);

/**
 * @desc    Get category by id
 * @route   GET /api/v1/category/:id
 * @access  Public
 */
router.get("/:id", getCategoryById);

/**
 * @desc    Get all categories
 * @route   GET /api/v1/category
 * @access  Public
 */
router.get("/", getAllCategories);

/**
 * @desc    Delete category by id
 * @route   DELETE /api/v1/category/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteCategoryById);

module.exports = router;
