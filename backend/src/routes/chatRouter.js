const express = require("express");
const router = express.Router();
const { chatController } = require("../controllers/chatController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, chatController.accessChats);
router.get("/", verifyToken, chatController.fetchChats);
router.post("/group", verifyToken, chatController.createGroupChat);
router.put("/rename", verifyToken, chatController.renameGroup);
router.put("/group-remove", verifyToken, chatController.removeFromGroup);
router.put("/group-add", verifyToken, chatController.addToGroup);
router.put("/delete", verifyToken, chatController.deleteChat);

module.exports = router;
