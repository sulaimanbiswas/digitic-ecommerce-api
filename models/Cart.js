const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    cartTotal: {
      type: Number,
    },
    totalAfterDiscount: {
      type: Number,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
