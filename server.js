'use strict';

console.log('first server!')

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weather = require('./weather');
const movies = require('./movies');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/weather', weather.getWeather);
app.get('/movie', movies.getMovie);

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found!');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
