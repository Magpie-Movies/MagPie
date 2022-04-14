const {sequelize, DataTypes, Model} = require('./db')
const { Movie } = require('./models/movie');
const { Category } = require('./models/category')
const { Keyword } = require('./models/keyword')
const { Country } = require('./models/country')
const { Production_Company } = require('./models/production');
const { Cast_Crew } = require('./models/cast_crew')
const { Movie_Cast } = require('./models/movie_cast')
const { Movie_Crew } = require('./models/movie_crew');
const { Movie_Keywords } = require("./models/movie_keyword");
const { Movie_Genre } = require("./models/movie_genre");
const { Movie_Country } = require("./models/movie_country");
const { Movie_Production } = require("./models/movie_production");

  Category.belongsToMany(Movie, {
    through: "Movie_Genre",
    as: "movie",
    foreignKey: "category_id",
  });
  Movie.belongsToMany(Category, {
    through: "Movie_Genre",
    as: "category",
    foreignKey: "movie_id",
  });

  Keyword.belongsToMany(Movie, {
    through: "Movie_Keywords",
    foreignKey: "keyword_id",
  });
  Movie.belongsToMany(Keyword, {
    through: "Movie_Keywords",
    foreignKey: "movie_id",
  });

  Country.belongsToMany(Movie, {
    through: "Movie_Country",
    as: "movie",
    foreignKey: "country_id",
  });
  Movie.belongsToMany(Country, {
    through: "Movie_Country",
    as: "country",
    foreignKey: "movie_id",
  });

  Production_Company.belongsToMany(Movie, {
    through: "Movie_Production",
    as: "movie",
    foreignKey: "production_id",
  });
  Movie.belongsToMany(Production_Company, {
    through: "Movie_Production",
    as: "production_company",
    foreignKey: "movie_id",
  });

  Cast_Crew.belongsToMany(Movie, {
    through: Movie_Crew,
    as: "movieCrew",
    foreignKey: "castCrew_id",
  })
  Movie.belongsToMany(Cast_Crew, {
    through: Movie_Crew,
    as: "movieCrew",
    foreignKey: "movie_id",
  })

  Cast_Crew.belongsToMany(Movie, {
    through: Movie_Cast,
    as: "movie",
    foreignKey: "castCrew_id",
  })
  Movie.belongsToMany(Cast_Crew, {
    through: Movie_Cast,
    as: "movieCast",
    foreignKey: "movie_id",
  })

//export models with added associations
module.exports = {Movie, Category, Keyword,Country, Production_Company, Cast_Crew, Movie_Cast, Movie_Crew, Movie_Keywords,Movie_Genre, Movie_Country, Movie_Production, sequelize}
