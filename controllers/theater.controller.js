import {
  createTheatre,
  fetchTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
  fetchTheatresByFilter,
} from '../services/theater.service.js';
import { errorResponse, successResponse } from '../utils/response.js';

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
    const response = await fetchTheatres();
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
    const response = await fetchTheatresByFilter(req.query);
    res.status(200).json(successResponse('Theatres retrieved successfully by filter', response));
  } catch (error) {
    console.error('Error retrieving theatres by filter:', error);
    res.status(500).json(errorResponse('Error retrieving theatres by filter', error));
  }
};