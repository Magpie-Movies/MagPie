const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Movie_Crew extends Model {}

Movie_Crew.init(
  {
    department: DataTypes.STRING,
    job: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Movie_Crew };
