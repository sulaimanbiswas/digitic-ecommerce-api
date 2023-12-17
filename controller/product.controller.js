const Product = require("../models/Product");
const expressAsyncHandler = require("express-async-handler");

// create a new product
const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
};
