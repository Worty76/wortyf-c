const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// User
router.get("/", verifyToken, userController.searchUsers);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/guardians", userController.getGuardians);
router.put("/update", verifyToken, userController.updateUser);
router.get("/:id", userController.getUser);
router.get("/:id/photo", userController.photo);
router.put("/:id/change-avatar", verifyToken, userController.changeAvatar);

// Admin
router.get(
  "/admin/get-users",
  verifyToken,
  checkRole("admin"),
  userController.getUsers
);
router.put(
  "/update-role/:id",
  verifyToken,
  checkRole("admin"),
  userController.changeRole
);

module.exports = router;
