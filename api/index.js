const db = require('./db');
const { Movie } = require('./models/movie');
const { Category } = require('./models/category')
const { Keyword } = require('./models/keyword')
const { Country } = require('./models/country')



async function initialiseDb() {
    Category.belongsToMany(Movie, {
        through: "Movie_Category",
        as: "movie",
        foreignKey: "movie_id",
      });
      Movie.belongsToMany(Category, {
        through: "Movie_Category",
        as: "category",
        foreignKey: "category_id",
      });

    // Movie.hasMany(Category)
    // Category.belongsTo(Movie)
    await db.sync();
}

module.exports =  initialiseDb ;

