exports.getUserController = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};
