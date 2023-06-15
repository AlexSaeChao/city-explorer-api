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
    const keywordFromFrontend = request.query.searchQuery;


    const url = `http://api.weatherbit.io/v2.0/forecast/daily?city=${keywordFromFrontend}&key=${process.env.WEATHER_API_KEY}`;

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

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found!');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
