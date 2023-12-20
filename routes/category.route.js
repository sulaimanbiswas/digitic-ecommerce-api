const {
  createCategory,
  updateCategoryById,
} = require("../controller/category.controller");
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

module.exports = router;
