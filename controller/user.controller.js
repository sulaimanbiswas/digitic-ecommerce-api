const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {}
};

module.exports = { createUser };
