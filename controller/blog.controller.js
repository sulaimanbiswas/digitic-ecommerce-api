const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");
const slugifyTitle = require("../utils/slugify");
const validateMongoDbId = require("../utils/validateMongoDbId");
const cloudinaryUpload = require("../utils/cloudinary");
const fs = require("fs");

// create blog
const createBlog = expressAsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugifyTitle(req.body.title);
    }
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// like blog
const likeBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const currentUserId = req?.user?._id;
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === currentUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: currentUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog disliked successfully",
        data: blog,
      });
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: currentUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog disliked successfully",
        data: blog,
      });
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: currentUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog liked successfully",
        data: blog,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// dislike blog
const dislikeBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const currentUserId = req?.user?._id;

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    const isDisliked = blog?.isDisliked;

    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === currentUserId?.toString()
    );

    if (alreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: currentUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog disliked successfully",
        data: updatedBlog,
      });
    }
    if (isDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: currentUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog disliked successfully",
        data: updatedBlog,
      });
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: currentUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog disliked successfully",
        data: updatedBlog,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// upload blog images by id
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
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((item) => item.url),
      },
      { new: true }
    );
    if (!blog) {
      res.status(404);
      throw new Error("Unable to upload images");
    }
    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update a blog by id
const updateBlog = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugifyTitle(req.body.title);
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get blog by id
const getBlogById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findById(id);
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { countViews: 1 },
      },
      { new: true }
    )
      .populate("likes")
      .populate("dislikes")
      .populate("category")
      .populate("postedBy");
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all blog
const getAllBlogs = expressAsyncHandler(async (req, res) => {
  try {
    const blog = await Blog.find({}).populate("category");
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete blog by id
const deleteBlogById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
  updateBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
};
