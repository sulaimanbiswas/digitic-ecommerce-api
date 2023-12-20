const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/Category");

const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Unable to create category",
      });
    }
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
};
