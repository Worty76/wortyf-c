const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/login", userController.login);

router.post("/register", userController.register);

router.get("/users", userController.getUsers);

router.get("/:id", userController.getUser);

router.put("/:id/changeAvt", verifyToken, userController.changeAvatar);

router.get("/:id/photo", userController.photo);

module.exports = router;
