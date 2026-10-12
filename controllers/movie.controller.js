import {
  createMovie as createMovieService,
  getMovieByIdService,
  fetchMovies,
  fetchMoviesWithTheatres,
  fetchTheatresByMovie,
  updateMovie,
  deleteMovie,
} from '../services/movie.service.js';
import { getPagination } from '../utils/pagination.js';
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
    const movie = await createMovieService(req.body);

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
    console.log('Fetching movies from PostgreSQL...');

    const { page, limit } = getPagination(req.query);
    const response = await fetchMovies({}, page, limit);

    console.log(`Movies fetched successfully. Count: ${response.movies.length}`);

    return res.status(200).json(successResponse('Movies retrieved successfully', response));
  } catch (error) {
    console.error('Error retrieving movies:', error);

    return res.status(500).json(errorResponse('Error retrieving movies', error));
  }
};

export const getMovieById = async (req, res) => {
  try {
    console.log('Fetching movie from PostgreSQL...');

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
    console.log('Deleting movie from PostgreSQL...');

    const response = await deleteMovie(req.params.id);
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
    console.log('Updating movie in PostgreSQL...');

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
    const { page, limit } = getPagination(req.query);
    const response = await fetchMovies(req.query, page, limit);
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

export const searchMovies = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await fetchMoviesWithTheatres(req.query, page, limit);

    if (response.err) {
      return res.status(response.code).json(
        errorResponse('Movie search failed', response.err),
      );
    }

    return res.status(200).json(successResponse('Movies searched successfully', response));
  } catch (error) {
    console.error('Error searching movies:', error);
    return res.status(500).json(errorResponse('Error searching movies', error));
  }
};

export const getTheatresByMovie = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await fetchTheatresByMovie(req.params.id, page, limit);

    if (response.err) {
      return res.status(response.code).json(errorResponse(response.err, response.err));
    }

    return res.status(200).json(successResponse('Theatres retrieved for movie', response));
  } catch (error) {
    console.error('Error retrieving theatres for movie:', error);
    return res.status(500).json(errorResponse('Error retrieving theatres for movie', error));
  }
};
