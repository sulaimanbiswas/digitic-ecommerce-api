const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Color = require("../models/Color");

// create new color
const createColor = expressAsyncHandler(async (req, res) => {
  try {
    const color = await Color.create(req.body);
    if (!color) {
      res.status(400);
      throw new Error("Unable to create color");
    }
    res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update color by id
const updateColorById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedColor) {
      res.status(400);
      throw new Error("Unable to update color");
    }
    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: updatedColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get color by id
const getColorById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const color = await Color.findById(id);
    if (!color) {
      res.status(404);
      throw new Error("Color not found");
    }
    res.status(200).json({
      success: true,
      message: "Color fetched successfully",
      data: color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all colors
const getAllColors = expressAsyncHandler(async (req, res) => {
  try {
    const colors = await Color.find({});
    if (!colors) {
      res.status(404);
      throw new Error("No colors found");
    }
    res.status(200).json({
      success: true,
      message: "Colors fetched successfully",
      data: colors,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete color by id
const deleteColorById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const color = await Color.findByIdAndDelete(id);
    if (!color) {
      res.status(404);
      throw new Error("Color not found");
    }
    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      data: color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColorById,
  getColorById,
  getAllColors,
  deleteColorById,
};
