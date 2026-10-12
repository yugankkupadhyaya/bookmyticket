import {
  createTheatre,
  fetchTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
  fetchTheatresByFilter,
  searchTheatres,
  fetchTheatresByRating,
  updateMovieInTheatre,
  fetchMoviesByTheatre,
  checkMovieInTheatre,
} from '../services/theatre.service.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { getPagination } from '../utils/pagination.js';

export const createTheatreController = async (req, res) => {
  try {
    const data = req.body;
    const response = await createTheatre(data);
    res.status(201).json(successResponse('Theatre created successfully', response));
  } catch (error) {
    console.error('Error creating theatre:', error);
    res.status(500).json(errorResponse('Error creating theatre', error));
  }
};

export const getAllTheatresController = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await fetchTheatres(page, limit);
    res.status(200).json(successResponse('Theatres retrieved successfully', response));
  } catch (error) {
    console.error('Error retrieving theatres:', error);
    res.status(500).json(errorResponse('Error retrieving theatres', error));
  }
};

export const getTheatreByIdController = async (req, res) => {
  try {
    const response = await getTheatreById(req.params.id);
    if (!response) {
      return res.status(404).json(errorResponse('Theatre not found', 'Theatre not found'));
    }
    res.status(200).json(successResponse('Theatre retrieved successfully', response));
  } catch (error) {
    console.error('Error retrieving theatre:', error);
    res.status(500).json(errorResponse('Error retrieving theatre', error));
  }
};

export const updateTheatreController = async (req, res) => {
  try {
    const response = await updateTheatre(req.params.id, req.body);
    if (!response) {
      return res.status(404).json(errorResponse('Theatre not found', 'Theatre not found'));
    }
    res.status(200).json(successResponse('Theatre updated successfully', response));
  } catch (error) {
    console.error('Error updating theatre:', error);
    res.status(500).json(errorResponse('Error updating theatre', error));
  }
};

export const deleteTheatreController = async (req, res) => {
  try {
    const response = await deleteTheatre(req.params.id);
    if (!response) {
      return res.status(404).json(errorResponse('Theatre not found', 'Theatre not found'));
    }
    res.status(200).json(successResponse('Theatre deleted successfully', response));
  } catch (error) {
    console.error('Error deleting theatre:', error);
    res.status(500).json(errorResponse('Error deleting theatre', error));
  }
};

export const getTheatresByFilterController = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await fetchTheatresByFilter(req.query, page, limit);
    res.status(200).json(successResponse('Theatres retrieved successfully by filter', response));
  } catch (error) {
    console.error('Error retrieving theatres by filter:', error);
    res.status(500).json(errorResponse('Error retrieving theatres by filter', error));
  }
};

export const searchTheatresController = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await searchTheatres(req.query.q, page, limit);

    if (response.err) {
      return res.status(response.code).json(errorResponse(response.err, response.err));
    }

    return res.status(200).json(successResponse('Theatres searched successfully', response));
  } catch (error) {
    console.error('Error searching theatres:', error);
    return res.status(500).json(errorResponse('Error searching theatres', error));
  }
};

export const getTheatresByRatingController = async (req, res) => {
  try {
    const { minRating } = req.query;
    const parsedMinRating = Number(minRating);

    if (
      minRating === undefined ||
      minRating === '' ||
      !Number.isFinite(parsedMinRating) ||
      parsedMinRating < 0 ||
      parsedMinRating > 5
    ) {
      return res
        .status(400)
        .json(errorResponse('Invalid minRating', 'minRating must be a number between 0 and 5'));
    }

    const { page, limit } = getPagination(req.query);
    const response = await fetchTheatresByRating(parsedMinRating, page, limit);
    res.status(200).json(successResponse('Theatres retrieved successfully by rating', response));
  } catch (error) {
    console.error('Error retrieving theatres by rating:', error);
    res.status(500).json(errorResponse('Error retrieving theatres by rating', error));
  }
};

export const updateMovieInTheatreController = async (req, res) => {
  try {
    const { movieIds, insert } = req.body;
    const response = await updateMovieInTheatre(req.params.id, movieIds, insert);
    res.status(200).json(successResponse('Movies updated successfully in theatre', response));
  } catch (error) {
    console.error('Error updating movies in theatre:', error);

    if (error.message === 'Theatre not found') {
      return res.status(404).json(errorResponse('Theatre not found', error.message));
    }

    if (error.message === 'One or more movies not found') {
      return res.status(404).json(errorResponse('Movie not found', error.message));
    }

    res.status(500).json(errorResponse('Error updating movies in theatre', error));
  }
};

export const getMoviesByTheatreController = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const response = await fetchMoviesByTheatre(req.params.id, page, limit);

    if (response.err) {
      return res.status(response.code).json(errorResponse(response.err, response.err));
    }

    return res.status(200).json(successResponse('Movies retrieved for theatre', response));
  } catch (error) {
    console.error('Error retrieving movies for theatre:', error);
    return res.status(500).json(errorResponse('Error retrieving movies for theatre', error));
  }
};

export const checkMovieInTheatreController = async (req, res) => {
  try {
    const response = await checkMovieInTheatre(req.params.id, req.params.movieId);

    if (response.err) {
      return res.status(response.code).json(errorResponse(response.err, response.err));
    }

    return res.status(200).json(successResponse('Movie availability checked', response));
  } catch (error) {
    console.error('Error checking movie availability:', error);
    return res.status(500).json(errorResponse('Error checking movie availability', error));
  }
};
