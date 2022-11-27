const jwt = require("jsonwebtoken");

exports.generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY);
};

exports.generateBearerToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "10m",
  });
};
