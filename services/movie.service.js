import Movie from '../models/movie.model.js';

const getMovieByIdService = async (id) => {
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return { err: 'Movie not found', code: 404 };
    }
    return movie;
  } catch (error) {
    console.error('Error retrieving movie by ID:', error);
    throw error;
  }
};

export default getMovieByIdService;
