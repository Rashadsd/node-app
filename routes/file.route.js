const { Router } = require("express");
const router = Router();
const upload = require("../utils/multer");
const auth = require("../middlewares/auth.middleware");
const {
  getFileListController,
  getFileController,
  downloadFileController,
  fileUploadController,
  deleteFileController,
  updateFileController,
} = require("../controllers/file.controller");

// /file/list [GET]
router.get("/list", auth, getFileListController);

// /file/:id [GET]
router.get("/:id", auth, getFileController);

// /file/download/:id [GET]
router.get("/download/:id", auth, downloadFileController);

// /file/upload [POST]
router.post("/upload", auth, upload.single("file"), fileUploadController);

// /file/delete/:id [DELETE]
router.delete("/delete/:id", auth, deleteFileController);

// /file/update/:id [PUT]
router.put("/update/:id", auth, upload.single("file"), updateFileController);

module.exports = router;
