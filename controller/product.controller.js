const Product = require("../models/Product");
const expressAsyncHandler = require("express-async-handler");
const slugifyTitle = require("../utils/slugify");
const validateMongoDbId = require("../utils/validateMongoDbId");
const User = require("../models/User");
const cloudinaryUpload = require("../utils/cloudinary");
const fs = require("fs");

// create a new product
const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugifyTitle(req.body.title);
    }
    const product = await Product.create(req.body);
    if (!product) {
      res.status(400);
      throw new Error("Product not created");
    }
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// add to wishlist
const addToWishList = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const productId = req.body.productId;
  validateMongoDbId(productId);
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const alreadyInWishList = user.wishlist.find(
      (item) => item.toString() === productId.toString()
    );
    if (alreadyInWishList) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        data: user,
      });
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        data: user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// rating and review a product
const ratingAndReview = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const { productId, star, review } = req.body;
  validateMongoDbId(productId);

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    const alreadyRated = product.rating.find(
      (item) => item.postedBy.toString() === id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        { rating: { $elemMatch: alreadyRated } },
        { $set: { "rating.$.star": star, "rating.$.review": review } },
        { new: true }
      );
      if (!updateRating) {
        res.status(404);
        throw new Error("Product rating not updated");
      }
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { rating: { star, review, postedBy: id } },
        },
        { new: true }
      );
      if (!rateProduct) {
        res.status(404);
        throw new Error("Product rating not updated");
      }
    }
    const totalRating = await Product.findById(productId);
    const total = totalRating.rating.length;
    const sum = totalRating.rating.reduce((acc, item) => acc + item.star, 0);
    const average = Math.round(sum / total);
    const updateRating = await Product.findByIdAndUpdate(
      productId,
      {
        $set: { totalRating: average },
      },
      { new: true }
    );
    if (!updateRating) {
      res.status(404);
      throw new Error("Product rating not updated");
    }
    res.status(200).json({
      success: true,
      message: "Product rating updated",
      data: updateRating,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// upload product images by id
const uploadImages = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
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
    const product = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((item) => item.url),
      },
      { new: true }
    );
    if (!product) {
      res.status(404);
      throw new Error("Unable to upload images");
    }
    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update a product by id
const updateProduct = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugifyTitle(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get a single product by id
const getProductById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
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
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Product.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    if (skip >= total) {
      res.status(404);
      throw new Error("This page does not exist");
    }
    query.skip(skip).limit(limit);

    const products = await query;

    if (products.length === 0) {
      res.status(404);
      throw new Error("Products not found");
    }
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete a product by id
const deleteProduct = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  addToWishList,
  ratingAndReview,
  uploadImages,
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProduct,
};
