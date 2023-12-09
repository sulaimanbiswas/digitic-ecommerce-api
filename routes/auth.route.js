const express = require("express");
const { createUser, loginUser } = require("../controller/user.controller");
const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
router.post("/register", createUser);

/**
 * @desc    Login user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
router.post("/login", loginUser);

module.exports = router;
