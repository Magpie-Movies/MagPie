const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const sequelize = require('./db');
const {User} = require('./models/user')
const initialiseDb = require('./index.js');

initialiseDb();
const {Movie} = require('./models/movie')
const { Category } = require('./models/category');
const { Country } = require('./models/country')


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

const categories = [
    {category_name: 'Action'},
    {category_name: 'Horror'},
    {category_name: 'Drama'},
    {category_name: 'Comedy'},
    {category_name: 'Science Fiction'},
    {category_name: 'Thriller'},
    {category_name: 'Fiction'}
];

const countries = [
    {country_name: 'US'},
    {country_name: 'France'},
    {country_name: 'Mexico'},
    {country_name: 'England'},
    {country_name: 'Korea'}
];


const seed = async () => {

    await sequelize.sync({ force: true });

    const users = await createUsers(); // create users w/ encrypted passwords

    const userPromises = users.map(user => User.create(user))
    const moviePromises = movies.map(movie => Movie.create(movie))
    const categoryPromises = categories.map(category => Category.create(category))
    const countryPromises = countries.map(country => Country.create(country))
    await Promise.all([...userPromises, ...moviePromises, ...categoryPromises, ...countryPromises]);
    console.log("db populated!")
}

seed();