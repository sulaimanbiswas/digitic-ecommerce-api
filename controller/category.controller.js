const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const validateMongoDbId = require("../utils/validateMongoDbId");

// create new category
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

// update category by id
const updateCategoryById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(400).json({
        success: false,
        message: "Unable to update category",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {}
});

module.exports = {
  createCategory,
  updateCategoryById,
};
