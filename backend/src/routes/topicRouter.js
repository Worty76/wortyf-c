const express = require("express");
const topicController = require("../controllers/topicController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.get("/", topicController.getTopics);
router.get("/:id", topicController.getTopic);
router.post(
  "/create",
  verifyToken,
  checkRole("moderator"),
  topicController.create
);
router.put(
  "/update/:id",
  verifyToken,
  checkRole("moderator"),
  topicController.update
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("moderator"),
  topicController.remove
);

module.exports = router;
