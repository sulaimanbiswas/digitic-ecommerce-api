const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 100,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    discountPercentage: {
      type: Number,
      trim: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    color: [],
    tags: [],
    rating: [
      {
        star: Number,
        review: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
