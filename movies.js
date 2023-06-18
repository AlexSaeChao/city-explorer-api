const axios = require('axios');

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}

async function getMovie(request, response, next) {
  try {
    const movieKeywordFromFrontend = request.query.mov;
    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}&query=${movieKeywordFromFrontend}`;

    const { data } = await axios.get(url);
    const groomedMovieData = data.results.map(movieObj => new Movie(movieObj));

    response.status(200).send(groomedMovieData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMovie
};
