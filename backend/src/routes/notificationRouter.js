const express = require("express");
const router = express.Router();
const {
  create,
  fetchNotifications,
  readNotification,
} = require("../controllers/notificationController");
const verifyToken = require("../middlewares/verifyToken");

router.route("/").get(verifyToken, fetchNotifications);
router.route("/create").post(verifyToken, create);
router.route("/read").put(verifyToken, readNotification);

module.exports = router;
