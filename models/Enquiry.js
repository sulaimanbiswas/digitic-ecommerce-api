const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "in-progress", "resolved"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Enquiry", enquirySchema);
