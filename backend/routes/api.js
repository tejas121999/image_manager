const express = require("express");
const router = express.Router();
const imageUpload = require("./imageApi");

router.use("/image", imageUpload);

module.exports = router;
