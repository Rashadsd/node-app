const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ status: "error", message: "You are not authenticated!" });
    }

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    if (!decode) {
      return res
        .status(400)
        .json({ status: "error", message: "Token is not valid!" });
    }

    req.user = await User.findById(decode._id).select("_id username");

    next();
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
