const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");

class Movie extends Model {}

Movie.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = { Movie };
