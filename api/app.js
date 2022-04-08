const express = require("express");
//require basicAuth
const basicAuth = require("express-basic-auth");
//require bcrypt
const bcrypt = require("bcrypt");
// set salt
const saltRounds = 2;

const { User } = require("./models/user");
const { Movie } = require("./models/movie");
const { use } = require("bcrypt/promises");

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
