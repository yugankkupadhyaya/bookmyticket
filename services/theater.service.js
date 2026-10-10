import { Theater } from '../models/theater.model.js';

export const createTheater = async (data) => {
  try {
    const response = await Theater.create(data);
    return response;
  } catch (error) {
    console.error('Error creating theater:', error);
    throw error;
  }
};

export const fetchTheaters = async () => {
  try {
    const theaters = await Theater.find();
    return theaters;
  } catch (error) {
    console.error('Error fetching theaters:', error);
    throw error;
  }
};

export const getTheaterById = async (id) => {
  try {
    const theater = await Theater.findById(id);
    return theater;
  } catch (error) {
    console.error('Error fetching theater:', error);
    throw error;
  }
};

export const updateTheater = async (id, data) => {
  try {
    const theater = await Theater.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return theater;
  } catch (error) {
    console.error('Error updating theater:', error);
    throw error;
  }
};

export const deleteTheater = async (id) => {
  try {
    const theater = await Theater.findByIdAndDelete(id);
    return theater;
  } catch (error) {
    console.error('Error deleting theater:', error);
    throw error;
  }
};

export const fetchTheatersByFilter = async (query) => {
  try {
    const filter = {};
    if (query.city) filter.city = query.city;
    if (query.pincode) filter.pincode = Number(query.pincode);
    if (query.name) filter.name = { $regex: query.name, $options: 'i' };

    const theaters = await Theater.find(filter);
    return theaters;
  } catch (error) {
    console.error('Error fetching theaters by filter:', error);
    throw error;
  }
};