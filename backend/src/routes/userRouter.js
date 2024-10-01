const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// User
router.get("/", verifyToken, userController.searchUsers);

router.post("/login", userController.login);

router.post("/register", userController.register);

router.get("/users", userController.getUsers);

router.get("/guardians", userController.getGuardians);

router.get("/:id", userController.getUser);

router.put("/:id/changeAvt", verifyToken, userController.changeAvatar);

router.get("/:id/photo", userController.photo);

// Admin

router.put(
  "/update-role/:id",
  verifyToken,
  checkRole("admin"),
  userController.changeRole
);

module.exports = router;
