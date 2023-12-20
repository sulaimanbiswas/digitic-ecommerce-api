const mongoose = require("mongoose");
const slugify = require("slugify");

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      required: true,
    },
    countViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      required: true,
      default:
        "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
