const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db");

class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { User };
