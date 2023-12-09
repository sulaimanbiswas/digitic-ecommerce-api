const express = require("express");
const { createUser } = require("../controller/user.controller");
const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
router.post("/register", createUser);

module.exports = router;
