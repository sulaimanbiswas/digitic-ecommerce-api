const express = require("express");
const {
  uploadImages,
  deleteImages,
} = require("../controller/upload.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  productImageResize,
  uploadPhoto,
} = require("../middlewares/uploadImages");

/**
 * @desc    Upload images
 * @route   POST /api/v1/upload/upload-images
 * @access  Private/Admin
 */
router.post(
  "/upload-images",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImages
);

/**
 * @desc    Delete image by id
 * @route   DELETE /api/v1/upload/delete-images/:id
 * @access  Private/Admin
 */
router.delete("/delete-image/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
