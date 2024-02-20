const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: function (v) {
        return /^[A-Z0-9]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  expiry: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > Date.now();
      },
      message: (props) => `${props.value} is not a valid expiry date!`,
    },
  },
  discount: {
    type: Number,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
