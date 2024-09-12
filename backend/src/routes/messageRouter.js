const express = require("express");
const router = express.Router();
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const verifyToken = require("../middlewares/verifyToken");

router.route("/").post(verifyToken, sendMessage);
router.route("/:chatId").get(verifyToken, allMessages);

module.exports = router;
