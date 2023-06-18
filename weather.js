const axios = require('axios');

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
    const { lat, lon } = request.query;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

    const { data } = await axios.get(url);
    const forecastToSend = data.data.map(forecastOBJ => new Forecast(forecastOBJ));

    response.status(200).send(forecastToSend);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWeather
};
