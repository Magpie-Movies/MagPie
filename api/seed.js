const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const {sequelize} = require('./db');
const {User} = require('./models/user')
const {Movie} = require('./models/movie')


const createUsers = async () => {

    let pw1 = await bcrypt.hash('password', 10);
    let pw2 = await bcrypt.hash('password', 10);
    let pw3 = await bcrypt.hash('password', 10);

    const users = [
        {username : 'Martin', password: pw1 },
        {username : 'Lowella', password : pw2 },
        {username : 'Saeed', password : pw3 }
    ];

    return users
}


const movies = [
    {name : 'Spiderman: No Way Home'},
    {name : 'Batman'},
    {name : 'Sonic the hedgehog'}
];


const seed = async () => {

    await sequelize.sync({ force: true });

    const users = await createUsers(); // create users w/ encrypted passwords

    const userPromises = users.map(user => User.create(user))
    const moviePromises = movies.map(movie => Movie.create(movie))
    await Promise.all([...userPromises, ...moviePromises]);
    console.log("db populated!")
}

seed();