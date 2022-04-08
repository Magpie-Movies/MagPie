const express = require("express");
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

// initialise Express
const app = express();

// specify out request bodies are json
app.use(express.json());

app.post("/users", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newUser = await User.create({ username, password: hash });
    res.json({ newUser });
  });
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
    console.log("Error ", err);
    callback(null, false);
  }
}

// routes go here
app.get("/", (req, res) => {
  res.send("<h1>App Running</h1>");
});

app.get("/users", async (req, res) => {
  const Allusers = await User.findAll();
  res.json(Allusers);
});

app.get("/users:id", async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  res.json(user);
});

app.get("/movies", async (req, res) => {
  const allMovies = await Movie.findAll();
  res.json(allMovies);
});

app.get("/movies:id", async (req, res) => {
  const moviePK = await Movie.findByPk(req.params.id);
  res.json(moviePK);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});