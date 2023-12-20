const { createCategory } = require("../controller/category.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new category
 * @route   POST /api/v1/category
 * @access  Private/Admin
 */

router.post("/", authMiddleware, isAdmin, createCategory);

module.exports = router;
