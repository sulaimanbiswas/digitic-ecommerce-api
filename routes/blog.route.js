const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controller/blog.controller");
const { uploadPhoto, blogImageResize } = require("../middlewares/uploadImages");
const router = express.Router();

/**
 * @desc    Create a new Blog
 * @route   POST /api/v1/blog
 * @access  Private/Admin
 */
router.post("/", authMiddleware, isAdmin, createBlog);

/**
 * @desc    Like a Blog by Id
 * @route   PUT /api/v1/blog/like
 * @access  Private/User & Admin
 */
router.put("/like", authMiddleware, likeBlog);

/**
 * @desc    Dislike a Blog by Id
 * @route   PUT /api/v1/blog/dislike
 * @access  Private/User & Admin
 */
router.put("/dislike", authMiddleware, dislikeBlog);

/**
 * @desc    Upload images by id
 * @route   PUT /api/v1/blog/upload-images/:id
 * @access  Private/Admin
 */
router.put(
  "/upload-images/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImageResize,
  uploadImages
);

/**
 * @desc    Update a Blog by Id
 * @route   PUT /api/v1/blog/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateBlog);

/**
 * @desc    Get a Blog by Id
 * @route   GET /api/v1/blog/:id
 * @access  Public
 */
router.get("/:id", getBlogById);

/**
 * @desc    Get all Blog
 * @route   GET /api/v1/blog/
 * @access  Public
 */
router.get("/", getAllBlogs);

/**
 * @desc    Delete a Blog by Id
 * @route   DELETE /api/v1/blog/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteBlogById);

module.exports = router;
