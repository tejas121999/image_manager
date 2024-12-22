const express = require("express");
const router = express.Router();
const controllers = require("../controllers/imageUpload");
const image = require("../middleware/imageUpload");

router.post("/upload", image.upload.single("image"), controllers.uploadImage);
router.post("/get", controllers.getImage);

module.exports = router;
