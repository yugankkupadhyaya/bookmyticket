import { Theatre } from '../models/theatre.model.js';
import { filterByFuzzyField } from '../utils/fuzzy-search.js';

export const createTheatre = async (data) => {
  try {
    const response = await Theatre.create(data);
    return response;
  } catch (error) {
    console.error('Error creating theatre:', error);
    throw error;
  }
};

export const fetchTheatres = async () => {
  try {
    const theatres = await Theatre.find();
    return theatres;
  } catch (error) {
    console.error('Error fetching theatres:', error);
    throw error;
  }
};

export const getTheatreById = async (id) => {
  try {
    const theatre = await Theatre.findById(id);
    return theatre;
  } catch (error) {
    console.error('Error fetching theatre:', error);
    throw error;
  }
};

export const updateTheatre = async (id, data) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return theatre;
  } catch (error) {
    console.error('Error updating theatre:', error);
    throw error;
  }
};

export const deleteTheatre = async (id) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(id);
    return theatre;
  } catch (error) {
    console.error('Error deleting theatre:', error);
    throw error;
  }
};

export const fetchTheatresByFilter = async (query) => {
  try {
    const filter = {};
    if (query.pincode) filter.pincode = Number(query.pincode);

    let theatres = await Theatre.find(filter);
    if (query.city) theatres = filterByFuzzyField(theatres, 'city', query.city);
    if (query.name) theatres = filterByFuzzyField(theatres, 'name', query.name);

    return theatres;
  } catch (error) {
    console.error('Error fetching theatres by filter:', error);
    throw error;
  }
};

export const fetchTheatresByRating = async (minRating) => {
  try {
    const theatres = await Theatre.find({ rating: { $gte: Number(minRating) } });
    return theatres;
  } catch (error) {
    console.error('Error fetching theatres by rating:', error);
    throw error;
  }
};
