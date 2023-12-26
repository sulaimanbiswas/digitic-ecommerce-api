const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Enquiry = require("../models/Enquiry");

// create new enquiry
const createEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    if (!enquiry) {
      res.status(400);
      throw new Error("Unable to create enquiry");
    }
    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update enquiry by id
const updateEnquiryById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEnquiry) {
      res.status(400);
      throw new Error("Unable to update enquiry");
    }
    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get enquiry by id
const getEnquiryById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404);
      throw new Error("Enquiry not found");
    }
    res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      data: enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all enquiries
const getAllEnquiries = expressAsyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find({});
    if (!enquiries) {
      res.status(404);
      throw new Error("No enquiries found");
    }
    res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      data: enquiries,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete enquiry by id
const deleteEnquiryById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      res.status(404);
      throw new Error("Enquiry not found");
    }
    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      data: enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiryById,
  getEnquiryById,
  getAllEnquiries,
  deleteEnquiryById,
};
