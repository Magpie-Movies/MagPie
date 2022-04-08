const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Movie_Cast extends Model {}

Movie_Cast.init(
  {
    character_name: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Cast };
