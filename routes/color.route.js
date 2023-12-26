const {
  createColor,
  updateColorById,
  getColorById,
  getAllColors,
  deleteColorById,
} = require("../controller/color.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new color
 * @route   POST /api/v1/color
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createColor);

/**
 * @decs    Update color by id
 * @route   PUT /api/v1/color/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateColorById);

/**
 * @decs    Get color by id
 * @route   GET /api/v1/color/:id
 * @access  Public
 */
router.get("/:id", getColorById);

/**
 * @decs    Get all colors
 * @route   GET /api/v1/color
 * @access  Public
 */
router.get("/", getAllColors);

/**
 * @decs    Delete color by id
 * @route   DELETE /api/v1/color/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteColorById);

module.exports = router;
