const express = require("express");
const router = express.Router();
const {
  create,
  fetchNotifications,
} = require("../controllers/notificationController");
const verifyToken = require("../middlewares/verifyToken");

router.route("/").get(verifyToken, fetchNotifications);
router.route("/create").post(verifyToken, create);

module.exports = router;
