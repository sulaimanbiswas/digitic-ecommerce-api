const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    const db = mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
