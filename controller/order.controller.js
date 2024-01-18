const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const uniqid = require("uniqid"); // npm install uniqid
const validateMongoDbId = require("../utils/validateMongoDbId");
const Product = require("../models/Product");

// create order
const createOrder = expressAsyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    if (!COD) {
      res.status(400);
      throw new Error("Payment method not selected");
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const cart = await Cart.findOne({ orderedBy: user._id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart is empty");
    }
    let finalAmount = 0;
    if (couponApplied && cart.totalAfterDiscount) {
      finalAmount = cart.totalAfterDiscount;
    } else {
      finalAmount = cart.cartTotal;
    }
    const newOrder = await new Order({
      products: cart.products,
      paymentIntent: {
        id: uniqid("order-"),
        amount: finalAmount,
        currency: "usd",
        status: "Not Processed",
        created: Date.now(),
        payment_method_types: ["COD"],
      },
      orderedBy: user._id,
      orderStatus: "Not Processed",
    }).save();
    if (!newOrder) {
      res.status(400);
      throw new Error("Order not created");
    }
    // decrement quantity, increment sold
    const bulkOption = cart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // important item.product
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    const updated = await Product.bulkWrite(bulkOption, {});
    if (!updated) {
      res.status(400);
      throw new Error("Product quantity update failed");
    }
    // remove cart from db
    await Cart.findOneAndDelete({ orderedBy: user._id });
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update order status
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { orderId, orderStatus } = req.body;
  validateMongoDbId(orderId);
  try {
    const updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, paymentIntent: { status: orderStatus } },
      { new: true }
    );
    if (!updated) {
      res.status(400);
      throw new Error("Order status update failed");
    }
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updated,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get orders current user
const getOrderMe = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const orders = await Order.findOne({ orderedBy: user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    if (!orders) {
      res.status(404);
      throw new Error("Orders not found");
    }
    res.status(200).json({
      success: true,
      message: "Orders found successfully",
      data: orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get orders
const getOrder = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products.product")
      .populate("orderedBy")
      .sort({ createdAt: -1 })
      .exec();

    if (!orders) {
      res.status(404);
      throw new Error("Orders not found");
    }
    res.status(200).json({
      success: true,
      message: "Orders found successfully",
      data: orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createOrder,
  updateOrderStatus,
  getOrderMe,
  getOrder,
};
