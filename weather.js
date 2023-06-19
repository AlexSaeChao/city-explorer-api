'use strict';

const axios = require('axios');

let cache = {};

class Forecast {
  constructor(forecastOBJ) {
    this.description = forecastOBJ.weather.description;
    this.date = forecastOBJ.datetime;
    this.lowTemperature = forecastOBJ.low_temp;
    this.highTemperature = forecastOBJ.high_temp;
  }
}

async function getWeather(request, response, next) {
  try {
    let { lat, lon } = request.query;
    let key = `${request.query.lat}-${request.query.lon}-lat-lon-location`;
    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) {
console.log('cache was hit!', cache);
response.status(200).send(cache[key].data);

    } else {
      console.log('No item in cache');

      let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
      let { data } = await axios.get(url);
      let forecastToSend = data.data.map(forecastOBJ => new Forecast(forecastOBJ));

      cache[key] = {
        timestamp: Date.now(),
        data: forecastToSend,
      }
      response.status(200).send(forecastToSend);
    }

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWeather
};
