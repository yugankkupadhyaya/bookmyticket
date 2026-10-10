import Movie from '../models/movie.model.js';
import getMovieByIdService, { fetchMovies } from '../services/movie.service.js';
import { updateMovie } from '../services/movie.service.js';
export const ErrorResponseBody = {
  err: {},
  data: {},
  message: 'Something went wrong while processing the request',
  success: false,
};

export const SuccessResponseBody = {
  err: {},
  data: {},
  message: 'Suceessfully processed the request',
  success: true,
};

export const createMovie = async (req, res) => {
  console.log('POST /movies request received');
  console.log('Request body:', req.body);

  try {
    const movie = await Movie.create(req.body);

    console.log('Movie created successfully:', movie);

    return res.status(201).json({
      success: true,
      error: {},
      data: movie,
      message: 'Movie created successfully',
    });
  } catch (error) {
    console.error('Error creating movie:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error creating movie',
    });
  }
};

export const getAllMovies = async (req, res) => {
  console.log('GET /movies request received');

  try {
    console.log('Fetching movies from MongoDB...');

    const movies = await Movie.find();

    console.log(`Movies fetched successfully. Count: ${movies.length}`);
    console.log('Movies:', movies);

    return res.status(200).json({
      success: true,
      error: {},
      data: movies,
      message: 'Movies retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving movies:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error retrieving movies',
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    console.log('Fetching movie from MongoDB...');

    const response = await getMovieByIdService(req.params.id);
    if (response.err) {
      ErrorResponseBody.err = response.err;
      return res.status(response.code).json(ErrorResponseBody);
    }
    SuccessResponseBody.data = response;
    return res.status(200).json(SuccessResponseBody);
  } catch (error) {
    console.error('Error retrieving movie:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error retrieving movie',
    });
  }
};

export const deleteMovieById = async (req, res) => {
  try {
    console.log('Deleting movie from MongoDB...');

    const response = await Movie.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found',
        data: null,
        message: 'Movie not found',
      });
    }
    return res.status(200).json({
      success: true,
      error: {},
      data: response,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting movie:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error deleting movie',
    });
  }
};

export const updateMovieById = async (req, res) => {
  try {
    console.log('Updating movie in MongoDB...');

    const response = await updateMovie(req.params.id, req.body);

    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found',
        data: null,
        message: 'Movie not found',
      });
    }
    return res.status(200).json({
      success: true,
      error: {},
      data: response,
      message: 'Movie updated successfully',
    });
  } catch (error) {
    console.error('Error updating movie:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error updating movie',
    });
  }
};

export const getMoviesByFilter = async (req, res) => {
  try {
    const response = await fetchMovies(req.query);
    if (!response || response.err) {
      return res.status(response.code || 404).json({
        success: false,
        error: response.err || 'No movies found',
        data: null,
        message: 'No movies found for the given filter',
      });
    }
    return res.status(200).json({
      success: true,
      error: {},
      data: response,
      message: 'Movies retrieved successfully by filter',
    });
  } catch (error) {
    console.error('Error retrieving movies by filter:', error);

    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error retrieving movies by filter',
    });
  }
};
