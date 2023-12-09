const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");

const createUser = expressAsyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } else {
      throw new Error("User already exists");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // if user exists or not
    const user = await User.findOne({ email });
    if (user && user.isPasswordMatch(password)) {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createUser, loginUser };
