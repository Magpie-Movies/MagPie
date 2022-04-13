const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
//require basicAuth
const basicAuth = require("express-basic-auth");
//require bcrypt
const bcrypt = require("bcrypt");
// set salt
const saltRounds = 2;

//require models and associations
const initialiseDb = require('./index.js');
initialiseDb();

const { User } = require("./models/user");

const { use } = require("bcrypt/promises");
const { Movie } = require("./models/movie.js");
const { Cast_Crew } = require("./models/cast_crew.js");
const { Category } = require("./models/category.js");
const { Country } = require("./models/country.js");
const { Keyword } = require("./models/keyword.js");
const { Production_Company } = require("./models/production.js");
const { Movie_Keywords } = require("./models/movie_keyword");
const { Movie_Genre } = require("./models/movie_genre");
const { Movie_Country }  = require("./models/movie_country");
const { Movie_Production } = require("./models/movie_production");
const { Movie_Cast } = require("./models/movie_cast");
const { Movie_Crew } = require("./models/movie_crew");

// initialise Express
const app = express();

// serve static assets from the public/ folder
app.use(express.static(__dirname + '/public'));
// specify out request bodies are json
app.use(express.json());
// support the parsing of incoming requests with urlencoded payloads (e.g. form POST)
app.use(express.urlencoded({ extended: false }));

var jwt = require("express-jwt");
var jwks = require("jwks-rsa");

// routes go here
app.get("/", (req, res) => {
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
})

app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
})

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newUser = await User.create({ username, password: hash });
    res.json({ newUser });
  });
});

// var jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: "https://dev-dd5lawjq.us.auth0.com/.well-known/jwks.json",
//   }),
//   audience: "http://localhost:3000",
//   issuer: "https://dev-dd5lawjq.us.auth0.com/",
//   algorithms: ["RS256"],
// });

// app.use(jwtCheck);

// app.get("/authorized", function (req, res) {
//   res.send("Secured Resource");
// });

// app.use(
//   basicAuth({
//     authorizer: dbAuthorizer,
//     authorizeAsync: true,
//     unauthorizedResponse: () => "You do not have access to this content",
//   })
// );

//function to compare username and password
// return  boolean indicating a password match
// async function dbAuthorizer(username, password, callback) {
//   try {
//     // get matching user
//     const user = await User.findOne({ where: { username: username } });
//     // if username is valid compare passwords
//     let isValid =
//       user != null ? await bcrypt.compare(password, user.password) : false;
//     callback(null, isValid);
//     console.log("isValid", isValid);
//   } catch (err) {
//     //if authorize fails, log error
//     console.log("Error ", err);
//     callback(null, false);
//   }
// }

app.get("/users", async (req, res) => {
  const Allusers = await User.findAll();
  res.json(Allusers);
});

app.get("/users:id", async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  res.json(user);
});

//movie route 
//add movies
app.post("/movies", async(req, res) => {
  let newMovie = await Movie.create(req.body);
  res.json({newMovie})
});

//get all movies
app.get("/api/movies", async (req, res) => {
  const allMovies = await Movie.findAll();
  res.json({allMovies});
});

//get movies by id
app.get("/api/movies/:id", async (req, res) => {
  const getMovie = await Movie.findByPk(req.params.id);
  res.json({getMovie});
});

//get movies by keywords
app.get("/api/movies/search/keywords/:keywords", async(req, res) => {
  console.log([].concat(req.params.keywords))
  const movies = await Movie.findAll({
    include: {model: Keyword, where: { keyword_name: { [Op.like]: `%${req.params.keywords}%`}}
  }})
  res.json({movies})
})

app.get("/api/movies/search/keywords/", async(req, res) => {
  console.log([].concat(req.params.keywords))
  const movies = await Movie.findAll({
    include: {model: Keyword, where: { keyword_name: { [Op.or]: ["Fiction Spiderman", "Batman"]}}
  }})
  res.json({movies})
})

//category 
//add category entries to db
app.post("/api/categories", async(req, res) => {
  const newCategory = await Category.create(req.body);
  res.json({newCategory});
});

//get all categories
app.get("/api/categories", async(req, res) => {
  const allCategories = await Category.findAll();
  res.json({allCategories});
});

//get category by name
app.get("/api/categories/name/:name", async(req, res) =>{
  const getCategory = await Category.findAll({
    where: {
      category_name: req.params.name
    }
  })
  res.json({getCategory});
});

//get category by id
app.get("/api/categories/id/:id", async(req, res) => {
  const getCategory = await Category.findByPk(req.params.id)
  res.json({getCategory})
})

//update categories
app.put('/api/categories/:id', async(req, res)=> {
  let updateCategory = await Category.update(req.body, {
    where : {id : req.params.id}
  });
  res.json({updateCategory})
})

//delete categories
app.delete('/api/categories/:id', async(req, res)=> {
  await Category.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//country
//add country entries to the db
app.post("/api/countries", async(req, res) =>{
  let newCountry = await Country.create(req.bod);
  res.json({newCountry})
})

//get all countries
app.get("/api/countries", async(req, res) => {
  const allCountries = await Country.findAll();
  res.json({allCountries});
});

//get country by id
app.get("/api/countries/id/:id", async(req, res) =>{
  let getCountry = await Country.findByPk(req.params.id);
  res.json({getCountry})
})

//get country by name
app.get("/api/countries/name/:name", async(req, res) => {
  let getCountry = await Country.findAll({
    where: {
      country_name: req.params.name
    }
  });
  res.json({getCountry})
})

//update Country 
app.put("/api/countries/:id", async(req, res) => {
  const updateCountry = await Country.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json(updateCountry)
})

//delete country
app.delete("/api/countries/:id", async(req, res) => {
  await Country.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//keywords
//add keywords entries to the db
app.post("/api/keywords", async(req, res) => {
  let newKeyword = await Keyword.create(req.body);
  res.json(newKeyword);
});

//get keywords
app.get("/api/keywords", async(req, res) => {
  let allKeywords = await Keyword.findAll();
  res.json({allKeywords})
})

//get keywords by id
app.get("/api/keywords/id/:id", async(req, res) => {
  let getKeywords = await Keyword.findByPk(req.params.id)
  res.json({getKeywords})
})

//get keywords by name
app.get("/api/keywords/name/:name", async(req, res) => {
  let getKeywords = await Keyword.findAll({
    where: {
      keyword_name: req.params.name
    }
  })
  res.json({getKeywords})
})

//update keywords 
app.put("/api/keywords/:id", async(req, res) => {
  const updateKeyword = await Keyword.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updateKeyword})
})

//delete keyword
app.delete("/api/keywords/:id", async(req, res) => {
  await Keyword.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//Cast_Crew
//add Cast_Crew entries to the db
app.post("/api/person", async(req, res) => {
  let newPerson = await Cast_Crew.create(req.body);
  res.json(newPerson);
});

//get person
app.get("/api/person", async(req, res) => {
  let allPerson = await Cast_Crew.findAll();
  res.json(allPerson)
})

//get cast crew by id
app.get("/api/person/id/:id", async(req, res) => {
  let getPeron = await Cast_Crew.findByPk(req.params.id)
  res.json(getPerson)
})

//get cast_Crew by name
app.get("/api/person/name/:name", async(req, res) => {
  let getPerson = await Cast_Crew.findAll({
    where: {
      name: req.params.name
    }
  })
  res.json({getPerson})
})

//update Cast_Crew 
app.put("/api/person/:id", async(req, res) => {
  const updatePerson = await Cast_Crew.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updatePerson})
})

//delete Cast_Crew
app.delete("/api/person/:id", async(req, res) => {
  await Cast_Crew.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//Production_Company
//add production entries to the db
app.post("/api/production", async(req, res) => {
  let newProduction = await Production_Company.create(req.body);
  res.json(newProduction);
});

//get production
app.get("/api/production", async(req, res) => {
  let allProduction = await Production_Company.findAll();
  res.json(allProduction)
})

//get production by id
app.get("/api/production/id/:id", async(req, res) => {
  let getProduction = await Production_Company.findByPk(req.params.id)
  res.json(getProduction)
})

//get production_company by production name
app.get("/api/production/name/:name", async(req, res) => {
  let getProduction = await Production_Company.findAll({
    where: {
      name: req.params.name
    }
  })
  res.json({getProduction})
})

//update production company 
app.put("/api/production/:id", async(req, res) => {
  const updateProduction = await Production_Company.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updateProduction})
})

//delete production company
app.delete("/api/production/:id", async(req, res) => {
  await Production_Company.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//movie_keywords
app.post("/api/movie_keywords", async(req,res) => {
  let newMovieKeywords = await Movie_Keywords.create(req.body)
  res.json({newMovieKeywords})
})

//movie_genre
app.post("/api/movie_genre", async(req,res) => {
  let newMovieGenre = await Movie_Genre.create(req.body)
  res.json({newMovieGenre})
})

//movie_country
app.post("/api/movie_country", async(req,res) => {
  let newMovieCountry = await Movie_Country.create(req.body)
  res.json({newMovieCountry})
})

//movie_production
app.post("/api/movie_production", async(req, res) => {
  let newMovieProduction = await Movie_Production.create(req.body)
  res.json({newMovieProduction})
})

//movie_cast
app.post("/api/movie_cast", async(req, res) => {
  let newMovieCast = await Movie_Cast.create(req.body);
  res.json({newMovieCast})
})

//movie_crew
app.post("/api/mmovie_crew", async(req, res) => {
  let newMovieCrew = await Movie_Crew.create(req.body);
  res.json({newMovieCrew})
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
