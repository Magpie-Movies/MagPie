const db = require('../db');
const { DataTypes, Model } = require('sequelize');
const { Movie } = require('./movie');

class Movie_Production extends Model {}

Movie_Production.init(
  {
    production_id: DataTypes.INTEGER,
    movie_id: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Production };