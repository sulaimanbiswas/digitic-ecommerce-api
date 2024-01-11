const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const sendEmail = require("./email.controller");
const createHashToken = require("../utils/hashToken");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// create a new user
const createUser = expressAsyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      if (!newUser) {
        res.status(400);
        throw new Error("User not created");
      }
      const verifyToken = newUser.createVerifyToken();
      await newUser.save();
      const verifyUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/user/verify/${verifyToken}`;
      const data = {
        to: email,
        subject: "Email verification",
        text: `Your email verification link is ${verifyUrl}`,
        html: `<p>Your email verification link is <a href=${verifyUrl}>Click Here</a> this link is valid till 10 minutes.</p> <p><a href=${verifyUrl}>${verifyUrl}</a></p> <p>If you didn't request this email, please ignore it.</p> <p>Thanks</p><p>Team</p>`,
      };
      sendEmail(data);

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

// verify user by token
const verifyUser = expressAsyncHandler(async (req, res) => {
  const verifyToken = req.params.verifyToken;
  const hashToken = createHashToken(verifyToken);
  try {
    const user = await User.findOne({
      verifyToken: hashToken,
      verifyTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404);
      throw new Error("Invalid token or token expired");
    }
    user.status = "active";
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: user,
    });
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

    if (user.status === "blocked") {
      throw new Error("Your account is blocked");
    } else if (user.status === "deleted") {
      throw new Error("Your account is deleted");
    } else if (user.status === "rejected") {
      throw new Error("Your account is rejected");
    } else if (user.status === "banned") {
      throw new Error("Your account is banned");
    } else if (user.status === "suspended") {
      throw new Error("Your account is suspended");
    } else if (user.status === "pending") {
      throw new Error("Your account is pending");
    } else if (user.status === "inactive") {
      throw new Error("Your account is inactive");
    }

    if (
      user &&
      matchedPassword &&
      (user.status === "active" || user.status === "verified")
    ) {
      const refreshToken = generateRefreshToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      await User.findByIdAndUpdate(
        { _id: user._id },
        { refreshToken },
        { new: true, runValidators: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
      });

      const query = User.findById(user._id);
      const currentUser = await query.select("firstName lastName email role");

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: currentUser,
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

// admin login user by email and password
const loginAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // if user exists or not
    const admin = await User.findOne({ email });
    const matchedPassword = await admin.isPasswordMatch(password);

    if (admin.status === "blocked") {
      throw new Error("Your account is blocked");
    } else if (admin.status === "deleted") {
      throw new Error("Your account is deleted");
    } else if (admin.status === "rejected") {
      throw new Error("Your account is rejected");
    } else if (admin.status === "banned") {
      throw new Error("Your account is banned");
    } else if (admin.status === "suspended") {
      throw new Error("Your account is suspended");
    } else if (admin.status === "pending") {
      throw new Error("Your account is pending");
    } else if (admin.status === "inactive") {
      throw new Error("Your account is inactive");
    }

    if (admin.role !== "admin") {
      throw new Error("You are not admin");
    }

    if (
      admin &&
      matchedPassword &&
      (admin.status === "active" || admin.status === "verified") &&
      admin.role === "admin"
    ) {
      const refreshToken = generateRefreshToken({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
      });

      await User.findByIdAndUpdate(
        { _id: admin._id },
        { refreshToken },
        { new: true, runValidators: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
      });

      const query = User.findById(admin._id);
      const currentUser = await query.select("firstName lastName email role");

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          currentUser,
          token: generateToken({
            _id: admin._id,
            email: admin.email,
            role: admin.role,
          }),
        },
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

// forgot password
const forgotPassword = expressAsyncHandler(async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const resetToken = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/reset-password/${resetToken}`;
    const data = {
      to: email,
      subject: "Password reset",
      text: `Your password reset link is ${resetUrl}`,
      html: `<p>Your password reset link is <a href=${resetUrl}>Click Here</a> this link is valid till 10 minutes.</p> <p><a href=${resetUrl}>${resetUrl}</a></p> <p>If you didn't request this email, please ignore it.</p> <p>Thanks</p><p>Team</p>`,
    };
    sendEmail(data);
    res.status(200).json({
      success: true,
      message: "Password reset token sent to email",
      data: resetToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// reset password
const resetPassword = expressAsyncHandler(async (req, res) => {
  const password = req.body.password;
  const resetToken = req.params.resetToken;
  const hashToken = createHashToken(resetToken);
  try {
    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404);
      throw new Error("Invalid token or token expired");
    }
    if (password) {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
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

// save current user address
const saveAddress = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const updateAddress = await User.findByIdAndUpdate(
      id,
      {
        address: req.body.address,
      },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updateAddress) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updateAddress,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// add to wishlist
const addToWishList = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const productId = req.body.productId;
  validateMongoDbId(productId);
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const alreadyInWishList = user.wishlist.find(
      (item) => item.toString() === productId.toString()
    );
    if (alreadyInWishList) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        data: user,
      });
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        data: user,
      });
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

// get wishlist of current user
const getWishlist = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id)
      .populate("wishlist")
      .select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: user,
    });
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
  verifyUser,
  loginUser,
  loginAdmin,
  refreshToken,
  updatePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateMe,
  saveAddress,
  addToWishList,
  updateUserById,
  getUsers,
  getWishlist,
  getUserById,
  getMe,
  deleteUser,
};
