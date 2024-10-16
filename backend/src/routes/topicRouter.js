const express = require("express");
const topicController = require("../controllers/topicController");
const router = express.Router();

router.get("/", topicController.getTopics);
router.get("/:id", topicController.getTopic);
router.post("/create", topicController.create);
router.put("/update/:id", topicController.update);
router.delete("/delete/:id", topicController.remove);

module.exports = router;
