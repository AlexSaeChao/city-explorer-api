'use strict';

console.log('first server!')

// required
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// weather json  to use
let data = require('./data/weather.json')

// creating our server using express
// app === my server
const app = express();

// middleware
app.use(cors());

// define port
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`We are running on ${PORT}`));

// endpoints

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/weather', (request, response, next) => {
  try {
    const searchQuery = request.query.searchQuery;
    const city = data.find((cityWeather) =>
      cityWeather.city_name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!city) {
      response.status(404).json({ error: 'City not found' });
      return;
    }

    const forecastData = city.data.map((day) => {
      const lowTemp = day.low_temp.toFixed(1);
      const highTemp = day.high_temp.toFixed(1);
      const description = `Low of ${lowTemp}, high of ${highTemp} with ${day.weather.description}`;
      return new Forecast(day.valid_date, description);
    });

    response.status(200).json(forecastData);
  } catch (error) {
    next(error);
  }
});

//class to groom the bluky data
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

//  ** catch all endpoint - needs to be the last endpoint defined

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found!');
});

// error handling - plug and play code from express docs, middleware

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
