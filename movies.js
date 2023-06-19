const axios = require('axios');

let cache = {};

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}

async function getMovie(request, response, next) {
  try {
    let movieKeywordFromFrontend = request.query.mov;
    let key = `${movieKeywordFromFrontend}-movie-about-location`;
    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) {

      console.log('cache was hit!', cache);
      response.status(200).send(cache[key].data);

    } else {
      console.log('No item in cache');


      let url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}&query=${movieKeywordFromFrontend}`;
  
      let { data } = await axios.get(url);
      let groomedMovieData = data.results.map(movieObj => new Movie(movieObj));

      cache[key] = {
        timestamp: Date.now(),
        data: groomedMovieData,
      }

      response.status(200).send(groomedMovieData);

    }



  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMovie
};
