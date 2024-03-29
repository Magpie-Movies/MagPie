const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Movie_Genre extends Model {}

Movie_Genre.init(
  {
    movie_id: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Genre };