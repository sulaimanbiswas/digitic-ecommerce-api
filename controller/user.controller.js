const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");

// create a new user
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

// login user by email and password
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
        token: generateToken({
          _id: user._id,
          email: user.email,
          role: user.role,
        }),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// update Current user
const updateMe = expressAsyncHandler(async (req, res) => {
  const id = req.user?._id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(user, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// update a user by id
const updateUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(user, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
const getUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get a Current user
const getMe = expressAsyncHandler(async (req, res) => {
  const id = req.user?._id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select("-password");
    if (user) {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user by id
const getUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select("-password");
    if (user) {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// delete a user by id
const deleteUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select("-password");
    if (user) {
      await user.deleteOne(user);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  updateMe,
  updateUserById,
  getUsers,
  getUserById,
  getMe,
  deleteUser,
};
