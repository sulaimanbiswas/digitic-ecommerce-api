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

// get a single product by id
const getProductById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all products
const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
};
