const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Movie_Country extends Model {}

Movie_Country.init(
  {
    country_id: DataTypes.INTEGER,
    movie_id: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Country };