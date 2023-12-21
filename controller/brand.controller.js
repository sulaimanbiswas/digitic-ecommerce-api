const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Brand = require("../models/Brand");

// create new brand
const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    if (!brand) {
      res.status(400);
      throw new Error("Unable to create brand");
    }
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update brand by id
const updateBrandById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBrand) {
      res.status(400);
      throw new Error("Unable to update brand");
    }
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get brand by id
const getBrandById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json({
      success: true,
      message: "Brand fetched successfully",
      data: brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all brands
const getAllBrands = expressAsyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({});
    if (!brands) {
      res.status(404);
      throw new Error("No brands found");
    }
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete brand by id
const deleteBrandById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      data: brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrandById,
  getBrandById,
  getAllBrands,
  deleteBrandById,
};
