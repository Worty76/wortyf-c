const express = require("express");
const router = express.Router();
const {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");
const verifyToken = require("../middlewares/verifyToken");

router.route("/").post(verifyToken, accessChats);
router.route("/").get(verifyToken, fetchChats);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/group-remove").put(verifyToken, removeFromGroup);
router.route("/group-add").put(verifyToken, addToGroup);

module.exports = router;
