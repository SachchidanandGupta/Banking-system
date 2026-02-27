const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");
/**
 * -user register controller
 * -POST /api/auth/register
 */
async function registerController(req, res) {
  const { name, email, password } = req.body;
  const isExists = await userModel.findOne({ email });
  if (isExists) {
    return res.status(422).json({
      message: "User with this email already exits",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign(
    {
      userId: user._id,
      email,
    },
    process.env.JWT_SCERET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user stored in db",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "Email  is invalid",
      status: "failed",
    });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Password is invalid",
      status: "failed",
    });
  }
  const token = jwt.sign(
    {
      userId: user._id,
      email,
    },
    process.env.JWT_SCERET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

module.exports = {
  registerController,
  loginController,
};
