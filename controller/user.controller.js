const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require("../config/jwtToken");
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
    const matchedPassword = await user.isPasswordMatch(password);

    if (user && matchedPassword) {
      const refreshToken = generateRefreshToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { refreshToken },
        { new: true, runValidators: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
      });

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: updateUser,
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

// refresh token
const refreshToken = expressAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  try {
    const user = User.findOne({ refreshToken });
    if (!user) {
      throw new Error("No user found");
    }
    const decoded = verifyToken(refreshToken);
    const accessToken = generateToken({
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    });
    res.json({ accessToken });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
const updatePassword = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const password = req.body.password;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        data: updatedPassword,
      });
    } else {
      throw new Error("Password not updated");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// logout user
const logoutUser = expressAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(404);
    throw new Error("No refresh token");
  }
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(404);
      throw new Error("No user found");
    }
    await User.findByIdAndUpdate(user._id, { refreshToken: "" });
    res.clearCookie("refreshToken");
    res.status(200);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// update Current user
const updateMe = expressAsyncHandler(async (req, res) => {
  const id = req.user?._id;
  validateMongoDbId(id);
  try {
    const userId = await User.findById(id);
    if (userId) {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
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
  refreshToken,
  updatePassword,
  logoutUser,
  updateMe,
  updateUserById,
  getUsers,
  getUserById,
  getMe,
  deleteUser,
};
