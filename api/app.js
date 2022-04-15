require('dotenv').config();
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
const { Movie, Category, Keyword,Country, Production_Company, Cast_Crew, Movie_Cast, Movie_Crew, Movie_Keywords,Movie_Genre, Movie_Country, Movie_Production} = require("./index.js")
const { User } = require("./models/user");

const { use } = require("bcrypt/promises");

// initialise Express
const app = express();

// require cors
const cors = require('cors')

//allow cross-origin resource sharing
app.use(cors());

// serve static assets from the public/ folder
app.use(express.static(__dirname + "/public"));
// specify out request bodies are json
app.use(express.json());
// support the parsing of incoming requests with urlencoded payloads (e.g. form POST)
app.use(express.urlencoded({ extended: false }));

var jwtC = require("express-jwt");
var jwks = require("jwks-rsa");
const jwt = require('jsonwebtoken')

// routes go here
app.get("/", (req, res) => {});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/public/signin.html");
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newUser = await User.create({ username, password: hash });
    res.json({ newUser });
  });
});

app.post("/signin", async (req, res) => {
  // Authenticate User
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({ accessToken: accessToken });
});

// app.post(
//   "/signin",
//   async (req, res) => {
//     const username = req.body.username;
//     const user = await User.findOne({ where: { username: username } });
//     if (!user) {
//       res.status(401).send("User not found");
//     } else {
//       bcrypt.compare(req.body.password, user.password, function (err, result) {
//         if (user) {
//           const authToken = generateAuthToken();
//           console.log("authTokens", authTokens);

//           // Store authentication token
//           authTokens[authToken] = user;

//           // Setting the auth token in cookies
//           res.cookie("AuthToken", authToken);

//           // Redirect user to the protected page
//           res.redirect("/users");
//         } else {
//           res.status(401).send("Password incorrect");
//         }
//       });
//     }
//   }
// );

// var jwtCheck = jwtC({
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

app.get("/users", authenticateToken, async (req, res) => {
  const Allusers = await User.findAll();
  res.json(Allusers);
});

app.get("/users/:id", authenticateToken, async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  res.json(user);
});

//movie route
//add movies
app.post("/movies", authenticateToken, async (req, res) => {
  let movies = await Movie.create(req.body);
  res.json({ movies });
});

//get all movies
app.get("/api/movies", authenticateToken, async (req, res) => {
  const movies = await Movie.findAll({
    include: [
      {
        model: Cast_Crew, as: "movieCast"
      },
      {
        model: Cast_Crew, as: "movieCrew"
      },
      {
        model: Category, as: "category"
      },
      {
        model: Country, as: "country"
      }
    ]
  });
  res.json({ movies });
});

//get all movies without authenticateToken
app.get("/movies", async (req, res) => {
  const movies = await Movie.findAll({
    include: [
      {
        model: Cast_Crew, as: "movieCast"
      },
      {
        model: Cast_Crew, as: "movieCrew"
      },
      {
        model: Category, as: "category"
      },
      {
        model: Country, as: "country"
      }
    ]
  });
  res.json({ movies });
});

//get movies by id
app.get("/api/movies/search/id/:id", authenticateToken, async (req, res) => {
  const movie = await Movie.findByPk(req.params.id,
    {
      include: [
        {
          model: Cast_Crew, as: "movieCast"
        },
        {
          model: Cast_Crew, as: "movieCrew"
        },
        {
          model: Category, as: "category"
        },
        {
          model: Country, as: "country"
        }
      ]
    });
  res.json({movie});
});

//get movies by id without authenticateToken
app.get("/movies/search/id/:id", async (req, res) => {
  const movie = await Movie.findByPk(req.params.id,
    {
      include: [
        {
          model: Cast_Crew, as: "movieCast"
        },
        {
          model: Cast_Crew, as: "movieCrew"
        },
        {
          model: Category, as: "category"
        },
        {
          model: Country, as: "country"
        }
      ]
    });
  res.json({movie});
});


//get movies by keywords
// app.get("/api/movies/search/keywords/:keywords", authenticateToken, async(req, res) => {
//   console.log([].concat(req.params.keywords))
//   const movies = await Movie.findAll({
//     include: {model: Keyword, where: { keyword_name: { [Op.like]: `%${req.params.keywords}%`}}
//   }})
//   res.json({movies})
// })

// //get movies by keywords
app.get("/api/movies/search/keywords/:keywords", authenticateToken, async(req, res) => {
  const movies = await Movie.findAll({
    include: [
      {
        model: Keyword, where: { keyword_name: {[Op.like]: `%${req.params.keywords}%`}}
      },
      {
        model: Cast_Crew, as: "movieCast"
      },
      {
        model: Cast_Crew, as: "movieCrew"
      },
      {
        model: Category, as: "category"
      },
      {
        model: Country, as: "country"
      }
    ]
  })
  res.json({movies})
})

// //get movies by keywords without authenticateToken
app.get("/movies/search/keywords/:keywords", async(req, res) => {
  const movies = await Movie.findAll({
    include: [
      {
        model: Keyword, where: { keyword_name: {[Op.like]: `%${req.params.keywords}%`}}
      },
      {
        model: Cast_Crew, as: "movieCast"
      },
      {
        model: Cast_Crew, as: "movieCrew"
      },
      {
        model: Category, as: "category"
      },
      {
        model: Country, as: "country"
      }
    ]
  })
  res.json({movies})
})

//category 
//add category entries to db
app.post("/api/categories", authenticateToken, async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.json({ newCategory });
});

//get all categories
app.get("/api/categories", authenticateToken, async(req, res) => {
  const allCategories = await Category.findAll();
  res.json({ allCategories });
});

//get all categories without authenticateTOken
app.get("/categories", async(req, res) => {
  const allCategories = await Category.findAll();
  res.json({ allCategories });
});

//get category by name
app.get("/api/categories/name/:name", authenticateToken, async(req, res) =>{
  const getCategory = await Category.findAll({
    where: {
      category_name: req.params.name
    }
  })
  res.json({getCategory});
});

//get category by id
app.get("/api/categories/id/:id", authenticateToken, async(req, res) => {
  const getCategory = await Category.findByPk(req.params.id)
  res.json({getCategory})
})

//update categories
app.put('/api/categories/:id', authenticateToken, async(req, res)=> {
  let updateCategory = await Category.update(req.body, {
    where : {id : req.params.id}
  });
  res.json({updateCategory})
})

//delete categories
app.delete('/api/categories/:id', authenticateToken, async(req, res)=> {
  await Category.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//country
//add country entries to the db
app.post("/api/countries", authenticateToken, async (req, res) => {
  let newCountry = await Country.create(req.bod);
  res.json({ newCountry });
});

//get all countries
app.get("/api/countries", authenticateToken, async(req, res) => {
  const allCountries = await Country.findAll();
  res.json({allCountries});
});

//get all countries without authenticateToken
app.get("/countries", async(req, res) => {
  const allCountries = await Country.findAll();
  res.json({allCountries});
});

//get country by id
app.get("/api/countries/id/:id", authenticateToken, async(req, res) =>{
  let getCountry = await Country.findByPk(req.params.id);
  res.json({ getCountry });
});

//get country by name
app.get("/api/countries/name/:name", authenticateToken, async(req, res) => {
  let getCountry = await Country.findAll({
    where: {
      country_name: req.params.name,
    },
  });
  res.json({ getCountry });
});

//update Country 
app.put("/api/countries/:id", authenticateToken, async(req, res) => {
  const updateCountry = await Country.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.json(updateCountry);
});

//delete country
app.delete("/api/countries/:id", authenticateToken, async(req, res) => {
  await Country.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//keywords
//add keywords entries to the db
app.post("/api/keywords", authenticateToken, async(req, res) => {
  let newKeyword = await Keyword.create(req.body);
  res.json(newKeyword);
});

//get keywords
app.get("/api/keywords", authenticateToken, async(req, res) => {
  let allKeywords = await Keyword.findAll();
  res.json({allKeywords})
})

//get keywords without authenticateToken
app.get("/keywords", async(req, res) => {
  let allKeywords = await Keyword.findAll();
  res.json({allKeywords})
})

//get keywords by id
app.get("/api/keywords/id/:id", authenticateToken, async(req, res) => {
  let getKeywords = await Keyword.findByPk(req.params.id)
  res.json({getKeywords})
})

//get keywords by name
app.get("/api/keywords/name/:name", authenticateToken, async(req, res) => {
  let getKeywords = await Keyword.findAll({
    where: {
      keyword_name: req.params.name
    }
  })
  res.json({getKeywords})
})

//update keywords 
app.put("/api/keywords/:id", authenticateToken, async(req, res) => {
  const updateKeyword = await Keyword.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updateKeyword})
})

//delete keyword
app.delete("/api/keywords/:id", authenticateToken, async(req, res) => {
  await Keyword.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//Cast_Crew
//add Cast_Crew entries to the db
app.post("/api/person", authenticateToken,  async(req, res) => {
  let newPerson = await Cast_Crew.create(req.body);
  res.json(newPerson);
});


//get person
app.get("/api/person", authenticateToken, async(req, res) => {
  let allPerson = await Cast_Crew.findAll();
  res.json(allPerson)
})

//get cast crew by id
app.get("/api/person/id/:id", authenticateToken, async(req, res) => {
  let getPeron = await Cast_Crew.findByPk(req.params.id)
  res.json(getPerson)
})

//get cast_Crew by name
app.get("/api/person/name/:name", authenticateToken, async(req, res) => {
  let getPerson = await Cast_Crew.findAll({
    where: {
      name: req.params.name
    }
  })
  res.json({getPerson})
})

//update Cast_Crew 
app.put("/api/person/:id", authenticateToken, async(req, res) => {
  const updatePerson = await Cast_Crew.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updatePerson})
})

//delete Cast_Crew
app.delete("/api/person/:id", authenticateToken, async(req, res) => {
  await Cast_Crew.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//Production_Company
//add production entries to the db
app.post("/api/production", authenticateToken, async(req, res) => {
  let newProduction = await Production_Company.create(req.body);
  res.json(newProduction);
});

//get production
app.get("/api/production", authenticateToken, async(req, res) => {
  let allProduction = await Production_Company.findAll();
  res.json(allProduction)
})

//get production by id
app.get("/api/production/id/:id", authenticateToken, async(req, res) => {
  let getProduction = await Production_Company.findByPk(req.params.id)
  res.json(getProduction)
})

//get production_company by production name
app.get("/api/production/name/:name", authenticateToken, async(req, res) => {
  let getProduction = await Production_Company.findAll({
    where: {
      name: req.params.name
    }
  })
  res.json({getProduction})
})

//update production company 
app.put("/api/production/:id", authenticateToken, async(req, res) => {
  const updateProduction = await Production_Company.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  res.json({updateProduction})
})

//delete production company
app.delete("/api/production/:id", authenticateToken, async(req, res) => {
  await Production_Company.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

//movie_keywords
app.post("/api/movie_keywords", authenticateToken, async(req,res) => {
  let newMovieKeywords = await Movie_Keywords.create(req.body)
  res.json({newMovieKeywords})
})

//movie_genre
app.post("/api/movie_genre", authenticateToken, async(req,res) => {
  let newMovieGenre = await Movie_Genre.create(req.body)
  res.json({newMovieGenre})
})

//movie_country
app.post("/api/movie_country", authenticateToken, async(req,res) => {
  let newMovieCountry = await Movie_Country.create(req.body)
  res.json({newMovieCountry})
})

//movie_production
app.post("/api/movie_production", authenticateToken, async(req, res) => {
  let newMovieProduction = await Movie_Production.create(req.body)
  res.json({newMovieProduction})
})

//movie_cast
app.post("/api/movie_cast", authenticateToken, async(req, res) => {
  let newMovieCast = await Movie_Cast.create(req.body);
  res.json({newMovieCast})
})

//movie_crew
app.post("/api/mmovie_crew",authenticateToken,  async(req, res) => {
  let newMovieCrew = await Movie_Crew.create(req.body);
  res.json({newMovieCrew})
})

app.use(
  basicAuth({
    authorizer: dbAuthorizer,
    authorizeAsync: true,
    unauthorizedResponse: () => "You do not have access to this content",
  })
);

//function to compare username and password
// return  boolean indicating a password match
async function dbAuthorizer(username, password, callback) {
  try {
    // get matching user
    const user = await User.findOne({ where: { username: username } });
    // if username is valid compare passwords
    let isValid =
      user != null ? await bcrypt.compare(password, user.password) : false;
    callback(null, isValid);
    console.log("isValid", isValid);
  } catch (err) {
    //if authorize fails, log error
    res.send("401 Not Authorized");
    callback(null, false);
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
