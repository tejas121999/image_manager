const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {}
  Image.init(
    {
      image_file: {
        type: DataTypes.STRING,
        field: "image_file",
      },
    },
    {
      sequelize,
      tableName: "image",
      modelName: "Image",
      timestamps: true,
    }
  );
  return Image;
};
