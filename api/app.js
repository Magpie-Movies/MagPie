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

// specify out request bodies are json
app.use(express.json());

// routes go here
app.get("/", (req, res) => {
  res.send("<h1>App Running</h1>");
});

app.get('/movies', async (req, res)=> {
    const allMovies = await Movie.findAll()
    res.json(allMovies)
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
