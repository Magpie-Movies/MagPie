const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Movie_Keywords extends Model {}

Movie_Keywords.init(
  {
    keyword_id: DataTypes.INTEGER,
    movie_id: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Keywords };