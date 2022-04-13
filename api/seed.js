const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const sequelize = require('./db');
const { User } = require('./models/user')
const initialiseDb = require('./index.js');

initialiseDb();
const { Movie } = require('./models/movie')
const { Category } = require('./models/category');
const { Country } = require('./models/country');
const { Keyword } = require('./models/keyword');
const { Production_Company } = require('./models/production');
const { Cast_Crew } = require('./models/cast_crew');
const { Movie_Keywords } = require('./models/movie_keyword');
const { Movie_Genre } = require('./models/movie_genre');
const { Movie_Country } = require('./models/movie_country');
const { Movie_Production } = require("./models/movie_production");
const { Movie_Cast } = require("./models/movie_cast");
const { Movie_Crew } = require('./models/movie_crew');


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
    {name : 'Spiderman: No Way Home', release_date: '12/17/2021',
    overview:"With Spider-Man's identity now revealed, our friendly neighborhood web-slinger is unmasked and no longer able to separate his normal life as Peter Parker from the high stakes of being a superhero. When Peter asks for help from Doctor Strange, the stakes become it truly means to be Spider-Man",
    budget: 200000000.00,
    revenue: 189000000000.00},
    {name : 'The Batman', 
    release_date: '3/04/2022', 
    overview: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator's plans become clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued the metropolis.",
    budget: 185000000.00,
    revenue: 247000000.00 },
    {name : 'Sonic the hedgehog 2', release_date: '4/8/2022',
    overview: "After settlig in Green Hills, Sonic is eager to prove that he has what it takes to be a true hero. His test comes when Dr. Robotnik returns with a new partner, Knuckles, in search of a mystical emerald that has the power to destroy civilizations. Sonic teams up with his own sidekick, Tails, and together they embark on a globe-trotting journey to find the emerald before it falls into the wrong hands",
    budget: 110000000.00,
    revenue: 71000000.00}
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

const keywords = [
    {keyword_name: 'Suspense'},
    {keyword_name: 'Horror'},
    {keyword_name: 'Drama'},
    {keyword_name: 'Fiction Spiderman'},
    {keyword_name: 'Batman Columbia Fiction '},
    {keyword_name: 'Sonic the hedgeHog'}
];

const persons = [
    {name: 'Tom Holland'},
    {name: 'Tobey Maguire'},
    {name: 'Robert Pattinson'},
    {name: 'Jim Carrey'},
    {name: 'Idris Elba'},
    {name: 'Jeff Fowler'},
    {name: 'Jon Watts'},
    {name: 'Matt Reeves'}
];

const productions = [
    {production_name: 'Columbia Pictures'},
    {production_name: 'Sony Pictures'},
    {production_name: 'Warner Bros. Pictures'},
    {production_name: 'Paramount Pictures Studios'},
    {production_name: 'DC Films'}
];

const movie_keywords = [
    {keyword_id: 4, movie_id: 1},
    {keyword_id: 6, movie_id: 3},
    {keyword_id: 5, movie_id: 2}
];

const movie_genre = [
    {genre_id: 5, movie_id: 1},
    {genre_id: 5, movie_id: 3},
    {genre_id: 5, movie_id: 2}
];

const movie_country = [
    {country_id: 1, movie_id: 1},
    {country_id: 1, movie_id: 3},
    {country_id: 1, movie_id: 2}
];

const movie_production = [
    {production_id: 3, movie_id: 1},
    {production_id: 2, movie_id: 3},
    {production_id: 5, movie_id: 2}
];

const movie_cast = [
    {castCrew_id: 1, movie_id: 1, character_name: "Peter Parker"},
    {castCrew_id: 4, movie_id: 3, character_name: "Doctor Eggman"},
    {castCrew_id: 3, movie_id: 2, character_name: "Bruce Wayne"}
];

const movie_crew = [
    {castCrew_id: 7, movie_id: 1, department: "Direction", job: "Director"},
    {castCrew_id: 6, movie_id: 3, department: "Direction", job: "Director"},
    {castCrew_id: 8, movie_id: 2, department: "Direction", job: "Director"}
];

const seed = async () => {

    await sequelize.sync({ force: true });

    const users = await createUsers(); // create users w/ encrypted passwords

    const userPromises = users.map(user => User.create(user))
    const moviePromises = movies.map(movie => Movie.create(movie))
    const categoryPromises = categories.map(category => Category.create(category))
    const countryPromises = countries.map(country => Country.create(country))
    const keywordPromises = keywords.map(keyword => Keyword.create(keyword))
    const productionPromises = productions.map(production => Production_Company.create(production))
    const personPromises = persons.map(person => Cast_Crew.create(person))
    const movieKeywordPromises = movie_keywords.map(movieKeyword => Movie_Keywords.create(movieKeyword))
    const movieGenrePromises = movie_genre.map(movieGenre => Movie_Genre.create(movieGenre))
    const movieCountryPromises = movie_country.map(movieCountry => Movie_Country.create(movieCountry))
    const movieCastPromises = movie_cast.map(movieCast => Movie_Cast.create(movieCast))
    const movieProductionPromises = movie_production.map(movieProduction => Movie_Production.create(movieProduction))
    const movieCrewPromises = movie_crew.map(movieCrew => Movie_Crew.create(movieCrew))
    await Promise.all([...userPromises, ...moviePromises, ...categoryPromises, ...countryPromises, ...keywordPromises, ...productionPromises, ...personPromises, 
        ...movieKeywordPromises, ...movieGenrePromises, ...movieCountryPromises, ...movieProductionPromises, ...movieCastPromises, ...movieCrewPromises]);
    console.log("db populated!")
}

seed();