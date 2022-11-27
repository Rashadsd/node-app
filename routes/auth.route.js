const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth.middleware");

const {
  loginController,
  newTokenController,
  registerController,
  logoutController,
} = require("../controllers/auth.controller");

// /auth/signin [POST]
router.post("/signin", loginController);

// /auth/signin/new_token [POST]
router.post("/signin/new_token", newTokenController);

// /auth/signup [POST]
router.post("/signup", registerController);

// /auth/logout [GET]
router.get("/logout", auth, logoutController);

module.exports = router;
