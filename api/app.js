require('dotenv').config();

const express = require("express");
//require basicAuth
const basicAuth = require("express-basic-auth");
//require bcrypt
const bcrypt = require("bcrypt");
// set salt
const saltRounds = 2;

//require models and associations
const initialiseDb = require("./index.js");
initialiseDb();

const { User } = require("./models/user");

const { use } = require("bcrypt/promises");
const { Movie } = require("./models/movie.js");
const { Cast_Crew } = require("./models/cast_crew.js");
const { Category } = require("./models/category.js");
const { Country } = require("./models/country.js");

// initialise Express
const app = express();

// serve static assets from the public/ folder
app.use(express.static(__dirname + "/public"));
// specify out request bodies are json
app.use(express.json());
// support the parsing of incoming requests with urlencoded payloads (e.g. form POST)
app.use(express.urlencoded({ extended: false }));

var jwtC = require("express-jwt");
var jwks = require("jwks-rsa");
const jwt = require('jsonwebtoken')
// const authTokens = {};

// const generateAuthToken = () => {
//   return bcrypt.hashSync(Math.random().toString(), bcrypt.genSaltSync(8));
// };

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
app.post("/movies", async (req, res) => {
  let newMovie = await Movie.create(req.body);
  res.json({ newMovie });
});

//get all movies
app.get("/api/movies", authenticateToken, async (req, res) => {
  const allMovies = await Movie.findAll();
  res.json({ allMovies });
});

//get movies by id
app.get("/api/movies:id", authenticateToken, async (req, res) => {
  const moviePK = await Movie.findByPk(req.params.id);
  res.json({ moviePK });
});

//category
//add category entries to db
app.post("/api/categories", async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.json({ newCategory });
});

app.get("/api/categories", authenticateToken, async (req, res) => {
  const allCategories = await Category.findAll();
  res.json({ allCategories });
});

//get category
app.get("/api/categories:name", authenticateToken, async (req, res) => {
  const getCategory = await Category.findAll({
    where: {
      name: req.params.name,
    },
  });
  res.json({ getCategory });
});

//get category by id
app.put("/api/categories:id", async (req, res) => {
  const updateCategory = await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.json({ updateCategory });
});

//delete categories
app.delete("/api/categories:id", async (req, res) => {
  await Category.destroy({ where: { id: req.params.id } });
  res.send("Deleted!");
});

//country
//add country entries to the db
app.post("/api/countries", async (req, res) => {
  let newCountry = await Country.create(req.bod);
  res.json({ newCountry });
});

//get country by id
app.get("/api/countries:id", authenticateToken, async (req, res) => {
  let getCountry = await Country.findByPk(req.params.id);
  res.json({ getCountry });
});

//get country by name
app.get("/api/countries:name", authenticateToken, async (req, res) => {
  let getCountry = await Country.findAll({
    where: {
      country_name: req.params.name,
    },
  });
  res.json({ getCountry });
});

//update Country
app.put("/api/countries:id", async (req, res) => {
  const updateCountry = await Country.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.json(updateCountry);
});

//delete country
app.delete("/api/countries:id", async (req, res) => {
  await Country.destroy({ where: { id: req.params.id } });
  res.send("Deleted!");
});

app.post("/api/person", async (req, res) => {
  let newPerson = await Cast_Crew.create(req.body);
  res.json(newPerson);
});

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
    res.send('401 Not Authorized');
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
