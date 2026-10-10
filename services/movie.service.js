import Movie from '../models/movie.model.js';
import { filterByFuzzyField } from '../utils/fuzzy-search.js';

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

export const updateMovie = async (id, data) => {
  const movie = await Movie.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return movie;
};

export const fetchMovies = async (filter = {}) => {
  const movies = await Movie.find();
  const filteredMovies = filter.name
    ? filterByFuzzyField(movies, 'name', filter.name)
    : movies;
  if (!filteredMovies || filteredMovies.length === 0) {
    return { err: 'No movies found', code: 404 };
  }
  return filteredMovies;
};
