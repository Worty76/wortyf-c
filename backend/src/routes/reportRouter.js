const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", reportController.read);
router.post("/create/:id", verifyToken, reportController.create);

module.exports = router;
