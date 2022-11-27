const fs = require("fs/promises");
const path = require("path");
const Downloader = require("nodejs-file-downloader");
const File = require("../models/File");

exports.getFileListController = async (req, res) => {
  try {
    const { list_size = 10, page = 1 } = req.query;

    const skip = (page - 1) * list_size;

    const total = await File.count();
    const files = await File.find().limit(list_size).skip(skip);

    res.status(200).json({ files, total });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

exports.getFileController = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(400)
        .json({ status: "error", message: "File does not exist" });
    }

    res.status(200).json(file);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

exports.downloadFileController = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    const downloader = new Downloader({
      url: `${process.env.BASE_URL}/files/${file.filename}`,
      directory: "./public/downloads",
    });

    await downloader.download();
    res.status(200).json({ status: "success", message: "File downloaded" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

exports.fileUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "Enter file" });
    }

    const { filename, size, mimetype, originalname } = req.file;
    const pieces = originalname.split(".");

    const extension = pieces[pieces.length - 1];

    await File.create({
      filename,
      size,
      mimetype,
      extension,
      createdAt: new Date(),
    });

    res.json({ status: "success", message: "File uploaded successfully" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

exports.deleteFileController = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res
        .status(400)
        .json({ status: "error", message: "File does not exist" });
    }

    res
      .status(200)
      .json({ status: "success", message: "File deleted successfully" });

    await fs.unlink(
      path.join(__dirname, "..", "public", "files", file.filename)
    );
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

exports.updateFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "Enter file" });
    }
    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(400)
        .json({ status: "error", message: "File does not exist" });
    }

    await fs.unlink(
      path.join(__dirname, "..", "public", "files", file.filename)
    );

    const { filename, size, mimetype, originalname } = req.file;
    const pieces = originalname.split(".");

    const extension = pieces[pieces.length - 1];

    file.filename = filename;
    file.size = size;
    file.mimetype = mimetype;
    file.extension = extension;

    await file.save();

    res
      .status(200)
      .json({ status: "success", message: "File updated successfully" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};
