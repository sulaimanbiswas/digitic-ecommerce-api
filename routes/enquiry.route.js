const {
  createEnquiry,
  updateEnquiryById,
  getEnquiryById,
  getAllEnquiries,
  deleteEnquiryById,
} = require("../controller/enquiry.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

/**
 * @desc    Create new enquiry
 * @route   POST /api/v1/enquiry
 * @access  Public
 */
router.post("/", createEnquiry);

/**
 * @decs    Update enquiry by id
 * @route   PUT /api/v1/enquiry/:id
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, isAdmin, updateEnquiryById);

/**
 * @decs    Get enquiry by id
 * @route   GET /api/v1/enquiry/:id
 * @access  Public
 */
router.get("/:id", getEnquiryById);

/**
 * @decs    Get all enquiries
 * @route   GET /api/v1/enquiry
 * @access  Public
 */
router.get("/", getAllEnquiries);

/**
 * @decs    Delete enquiry by id
 * @route   DELETE /api/v1/enquiry/:id
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiryById);

module.exports = router;
