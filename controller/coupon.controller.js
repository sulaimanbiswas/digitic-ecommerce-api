const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Coupon = require("../models/Coupon");

// create new coupon
const createCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    if (!coupon) {
      res.status(400);
      throw new Error("Unable to create coupon");
    }
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
};
