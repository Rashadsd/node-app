const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/Token");
const {
  generateBearerToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Login
exports.loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Username or password is incorrect",
        });
      }

      const bearerToken = generateBearerToken(user);

      return res.status(200).json({ bearerToken });
    }

    res
      .status(400)
      .json({ status: "error", message: "Username or password is incorrect" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

// New Token
exports.newTokenController = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const refreshToken = await RefreshToken.findOne({
      token: refresh_token,
      isExpired: false,
    });

    if (!refreshToken) {
      return res
        .status(403)
        .json({ status: "error", message: "Refresh token is not valid!" });
    }

    const user = await User.findById(refreshToken.userId).select(
      "_id username"
    );

    const bearerToken = generateBearerToken(user);
    res.status(200).json({ bearerToken });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

// Sign Up
exports.registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      const saltRounds = 10;

      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);

      const user = new User({
        username,
        password: hash,
      });

      await user.save();

      const bearerToken = generateBearerToken(user);
      const refreshToken = generateRefreshToken(user);

      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
      });

      return res.status(201).json({ refreshToken, bearerToken });
    }

    res.json({ status: "error", message: "User already exists" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

// Logout
exports.logoutController = async (req, res) => {
  try {
    await RefreshToken.updateOne(
      { userId: req.user._id, isExpired: false },
      { $set: { isExpired: true } }
    );

    await RefreshToken.create({
      userId: req.user._id,
      token: generateRefreshToken(req.user),
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};
