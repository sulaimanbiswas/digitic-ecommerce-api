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

// update coupon by id
const updateCouponById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCoupon) {
      res.status(400);
      throw new Error("Unable to update coupon");
    }
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all coupons
const getAllCoupons = expressAsyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    if (!coupons) {
      res.status(400);
      throw new Error("Unable to fetch coupons");
    }
    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete coupon by id
const deleteCouponById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      res.status(400);
      throw new Error("Unable to delete coupon");
    }
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: deletedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  updateCouponById,
  getAllCoupons,
  deleteCouponById,
};
