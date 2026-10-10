import {
  createTheater,
  fetchTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
  fetchTheatersByFilter,
} from '../services/theater.service.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const createTheaterController = async (req, res) => {
  try {
    const data = req.body;
    const response = await createTheater(data);
    res.status(201).json(successResponse('Theater created successfully', response));
  } catch (error) {
    console.error('Error creating theater:', error);
    res.status(500).json(errorResponse('Error creating theater', error));
  }
};

export const getAllTheatersController = async (req, res) => {
  try {
    const response = await fetchTheaters();
    res.status(200).json(successResponse('Theaters retrieved successfully', response));
  } catch (error) {
    console.error('Error retrieving theaters:', error);
    res.status(500).json(errorResponse('Error retrieving theaters', error));
  }
};

export const getTheaterByIdController = async (req, res) => {
  try {
    const response = await getTheaterById(req.params.id);
    if (!response) {
      return res.status(404).json(errorResponse('Theater not found', 'Theater not found'));
    }
    res.status(200).json(successResponse('Theater retrieved successfully', response));
  } catch (error) {
    console.error('Error retrieving theater:', error);
    res.status(500).json(errorResponse('Error retrieving theater', error));
  }
};

export const updateTheaterController = async (req, res) => {
  try {
    const response = await updateTheater(req.params.id, req.body);
    if (!response) {
      return res.status(404).json(errorResponse('Theater not found', 'Theater not found'));
    }
    res.status(200).json(successResponse('Theater updated successfully', response));
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(500).json(errorResponse('Error updating theater', error));
  }
};

export const deleteTheaterController = async (req, res) => {
  try {
    const response = await deleteTheater(req.params.id);
    if (!response) {
      return res.status(404).json(errorResponse('Theater not found', 'Theater not found'));
    }
    res.status(200).json(successResponse('Theater deleted successfully', response));
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json(errorResponse('Error deleting theater', error));
  }
};

export const getTheatersByFilterController = async (req, res) => {
  try {
    const response = await fetchTheatersByFilter(req.query);
    res.status(200).json(successResponse('Theaters retrieved successfully by filter', response));
  } catch (error) {
    console.error('Error retrieving theaters by filter:', error);
    res.status(500).json(errorResponse('Error retrieving theaters by filter', error));
  }
};