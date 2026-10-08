import Movie from '../models/movie.model.js';
import getMovieByIdService from '../services/movie.service.js';

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
}
