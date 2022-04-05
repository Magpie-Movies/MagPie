const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const {sequelize} = require('./db');
const {User} = require('./models/user')
const {Movie} = require('./models/movie')


const createUsers = async () => {

    const users = [
        {name : 'Martin', password: '1234' },
        {name : 'Lowella', password : 'password'},
        {name : 'Saeed', password : 'secret'}
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