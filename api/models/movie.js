const {Model, DataTypes} = require('sequelize')
const db = require('../db');

class Movie extends Model {}
Movie.init({
    name: DataTypes.STRING,
    release_date: DataTypes.DATE,
    overview: DataTypes.STRING,
    budget: DataTypes.FLOAT,
    revenue: DataTypes.FLOAT
}, {
    sequelize: db,
    timestamps: false,
});

module.exports ={Movie}