'use strict';

console.log('first server!')

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/weather', async (request, response, next) => {
  try {
    const { lat, lon } = request.query;


    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

    let dataFromAxios = await axios.get(url)

    let forecastToSend = dataFromAxios.data.data.map(forecastOBJ => new Forecast(forecastOBJ));


    response.status(200).send(forecastToSend);
  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(forecastOBJ) {
    this.description = forecastOBJ.weather.description;
    this.date = forecastOBJ.datetime;
  }
}
// ---

app.get('/movie', async (request, response, next) => {
  try {
    const movieKeywordFromFrontend = request.query.mov;

   
    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}&query=${movieKeywordFromFrontend}`;

    let movieDataFromAxios = await axios.get(url)

    let groomedMovieData = movieDataFromAxios.data.results.map(movieObj => new Movie(movieObj));

    response.status(200).send(groomedMovieData);
  } catch (error) {
    next(error);
  }
});

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
  }
}

// ---
app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found!');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
