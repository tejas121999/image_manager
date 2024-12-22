const { Image } = require("../models");

exports.getImage = async (req, res) => {
  try {
  } catch (error) {}
};

exports.uploadImage = async (req, res) => {
  try {
    const payload = {
      image_file: req.file.filename,
    };
    const createImage = await Image.create(payload);
    if (!createImage) {
      return res.status(401).json({
        message: "failed to create",
      });
    } else {
      return res.status(200).json({
        message: "created",
        createImage,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
