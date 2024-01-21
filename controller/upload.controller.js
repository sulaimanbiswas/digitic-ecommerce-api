const expressAsyncHandler = require("express-async-handler");
const { cloudinaryUpload, cloudinaryDelete } = require("../utils/cloudinary");
const fs = require("fs");

// upload product images
const uploadImages = expressAsyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await cloudinaryUpload(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const images = urls.map((item) => item);
    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: images,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete product images
const deleteImages = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const uploader = await cloudinaryDelete(id, "images");
    if (!uploader) {
      res.status(404);
      throw new Error("Images not found");
    }
    res.status(200).json({
      success: true,
      message: "Images deleted successfully",
      data: uploader,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
