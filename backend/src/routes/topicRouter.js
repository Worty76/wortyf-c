const express = require("express");
const topicController = require("../controllers/topicController");
const router = express.Router();

router.get("/", topicController.getTopics);

module.exports = router;
