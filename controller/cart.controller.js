const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Coupon = require("../models/Coupon");

// add to cart
const addToCart = expressAsyncHandler(async (req, res) => {
  const { cart } = req.body;
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const products = [];
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const cartExistByThisUser = await Cart.findOne({ orderedBy: user._id });
    if (cartExistByThisUser) {
      await cartExistByThisUser.deleteOne({ orderedBy: user._id });
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.quantity = cart[i].quantity;
      object.color = cart[i].color;
      let priceFromDb = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = priceFromDb.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].quantity;
    }
    const newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();
    if (!newCart) {
      res.status(400);
      throw new Error("Cart not created");
    }
    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: newCart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get cart of current user
const getCart = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const cart = await Cart.findOne({ orderedBy: id })
      .populate("products.product")
      .select("-password");
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// empty cart of current user
const emptyCart = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const cart = await Cart.findOneAndDelete({ orderedBy: id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    res.status(200).json({
      success: true,
      message: "Cart emptied successfully",
      data: cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// apply coupon to cart
const applyCouponToCart = expressAsyncHandler(async (req, res) => {
  const applyCoupon = req.body.applyCoupon;
  const id = req.user._id;
  validateMongoDbId(id);
  try {
    const coupon = await Coupon.findOne({ name: applyCoupon }).exec();
    if (!coupon) {
      res.status(404);
      throw new Error("Coupon is not valid");
    }
    if (coupon.expiry < Date.now()) {
      res.status(404);
      throw new Error("Coupon is expired");
    }
    let { products, cartTotal } = await Cart.findOne({ orderedBy: id })
      .populate("products.product")
      .exec();
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * coupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderedBy: id },
      { totalAfterDiscount },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        totalAfterDiscount,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addToCart,
  getCart,
  emptyCart,
  applyCouponToCart,
};
