import Movie from '../models/movie.model.js';
import getMovieByIdService, { fetchMovies } from '../services/movie.service.js';
import { updateMovie } from '../services/movie.service.js';
import {
  ErrorResponseBody,
  SuccessResponseBody,
  errorResponse,
  successResponse,
} from '../utils/response.js';

export const createMovie = async (req, res) => {
  console.log('POST /movies request received');
  console.log('Request body:', req.body);

  try {
    const movie = await Movie.create(req.body);

    console.log('Movie created successfully:', movie);

    return res.status(201).json(successResponse('Movie created successfully', movie));
  } catch (error) {
    console.error('Error creating movie:', error);

    return res.status(500).json(errorResponse('Error creating movie', error));
  }
};

export const getAllMovies = async (req, res) => {
  console.log('GET /movies request received');

  try {
    console.log('Fetching movies from MongoDB...');

    const movies = await Movie.find();

    console.log(`Movies fetched successfully. Count: ${movies.length}`);
    console.log('Movies:', movies);

    return res.status(200).json(successResponse('Movies retrieved successfully', movies));
  } catch (error) {
    console.error('Error retrieving movies:', error);

    return res.status(500).json(errorResponse('Error retrieving movies', error));
  }
};

export const getMovieById = async (req, res) => {
  try {
    console.log('Fetching movie from MongoDB...');

    const response = await getMovieByIdService(req.params.id);
    if (response.err) {
      const errorResponse = { ...ErrorResponseBody };
      errorResponse.error = response.err;
      errorResponse.message = 'Error retrieving movie';
      return res.status(response.code).json(errorResponse);
    }
    const successResponse = { ...SuccessResponseBody };
    successResponse.data = response;
    successResponse.message = 'Movie retrieved successfully';
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error retrieving movie:', error);

    return res.status(500).json(errorResponse('Error retrieving movie', error));
  }
};

export const deleteMovieById = async (req, res) => {
  try {
    console.log('Deleting movie from MongoDB...');

    const response = await Movie.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json(errorResponse('Movie not found', 'Movie not found'));
    }
    return res.status(200).json(successResponse('Movie deleted successfully', response));
  } catch (error) {
    console.error('Error deleting movie:', error);

    return res.status(500).json(errorResponse('Error deleting movie', error));
  }
};

export const updateMovieById = async (req, res) => {
  try {
    console.log('Updating movie in MongoDB...');

    const response = await updateMovie(req.params.id, req.body);

    if (!response) {
      return res.status(404).json(errorResponse('Movie not found', 'Movie not found'));
    }
    return res.status(200).json(successResponse('Movie updated successfully', response));
  } catch (error) {
    console.error('Error updating movie:', error);

    return res.status(500).json(errorResponse('Error updating movie', error));
  }
};

export const getMoviesByFilter = async (req, res) => {
  try {
    const response = await fetchMovies(req.query);
    if (!response || response.err) {
      return res.status(response?.code || 404).json(
        errorResponse(
          'No movies found for the given filter',
          response?.err || 'No movies found',
        ),
      );
    }
    return res
      .status(200)
      .json(successResponse('Movies retrieved successfully by filter', response));
  } catch (error) {
    console.error('Error retrieving movies by filter:', error);

    return res.status(500).json(errorResponse('Error retrieving movies by filter', error));
  }
};
