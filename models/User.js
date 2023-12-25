const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const createHashToken = require("../utils/hashToken");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "pending",
        "deleted",
        "blocked",
        "rejected",
        "banned",
        "suspended",
        "verified",
      ],
      lowercase: true,
      default: "inactive",
    },
    address: {
      type: String,
    },
    cart: {
      type: Array,
      default: [],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.verifyToken = createHashToken(verifyToken);
  this.verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verifyToken;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = createHashToken(resetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
