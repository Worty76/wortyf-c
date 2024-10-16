const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, reportController.read);
router.post("/", reportController.create);

module.exports = router;
