const multer = require("multer");
const path = require("path");
const File = require("../models/File");

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
  async destination(req, file, cb) {
    if (req.method === "PUT") {
      const isExist = await File.findById(req.params.id);

      if (!isExist) {
        return cb(null, "");
      }
    }

    cb(null, path.join(__dirname, "..", "public", "files"));
  },
});

const imagesTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  if (imagesTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
