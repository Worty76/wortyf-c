const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/rate", verifyToken, ratingController.createRating);

module.exports = router;
