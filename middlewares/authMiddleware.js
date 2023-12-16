const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization?.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.payload?._id);
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const isAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

module.exports = { authMiddleware, isAdmin };
