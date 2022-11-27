const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth.middleware");

const { getUserController } = require("../controllers/profile.controller");

// /info [GET]
router.get("/", auth, getUserController);

module.exports = router;
