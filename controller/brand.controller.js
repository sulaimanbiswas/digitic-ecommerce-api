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

module.exports = {
  createBrand,
};
