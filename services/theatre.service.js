import { Theatre } from '../models/theatre.model.js';
import { filterByFuzzyField } from '../utils/fuzzy-search.js';
import { paginationMeta } from '../utils/pagination.js';

export const createTheatre = async (data) => {
  try {
    const response = await Theatre.create(data);
    return response;
  } catch (error) {
    console.error('Error creating theatre:', error);
    throw error;
  }
};

export const fetchTheatres = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const [theatres, total] = await Promise.all([
      Theatre.find().sort({ _id: 1 }).skip(skip).limit(limit),
      Theatre.countDocuments(),
    ]);

    return { theatres, pagination: paginationMeta(page, limit, total) };
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

export const fetchTheatresByFilter = async (query, page = 1, limit = 10) => {
  try {
    const filter = {};
    if (query.pincode) filter.pincode = Number(query.pincode);

    let theatres = await Theatre.find(filter);
    if (query.city) theatres = filterByFuzzyField(theatres, 'city', query.city);
    if (query.name) theatres = filterByFuzzyField(theatres, 'name', query.name);

    const total = theatres.length;
    const skip = (page - 1) * limit;
    return {
      theatres: theatres.slice(skip, skip + limit),
      pagination: paginationMeta(page, limit, total),
    };
  } catch (error) {
    console.error('Error fetching theatres by filter:', error);
    throw error;
  }
};

export const fetchTheatresByRating = async (minRating, page = 1, limit = 10) => {
  try {
    const filter = { rating: { $gte: Number(minRating) } };
    const skip = (page - 1) * limit;
    const [theatres, total] = await Promise.all([
      Theatre.find(filter).sort({ _id: 1 }).skip(skip).limit(limit),
      Theatre.countDocuments(filter),
    ]);

    return { theatres, pagination: paginationMeta(page, limit, total) };
  } catch (error) {
    console.error('Error fetching theatres by rating:', error);
    throw error;
  }
};

export const updateMovieInTheatre = async (theatreId, movieIds, insert) => {
  const theatre = await Theatre.findById(theatreId);

  if (!theatre) {
    throw new Error('Theatre not found');
  }

  const ids = Array.isArray(movieIds) ? movieIds : [movieIds];

  if (insert) {
    const existingMovieIds = new Set(theatre.movies.map((movieId) => movieId.toString()));
    const newMovieIds = ids.filter((movieId) => {
      const id = movieId.toString();

      if (existingMovieIds.has(id)) {
        return false;
      }

      existingMovieIds.add(id);
      return true;
    });

    theatre.movies.push(...newMovieIds);
  } else {
    theatre.movies = theatre.movies.filter(
      (existingMovieId) => !ids.some((movieId) => existingMovieId.toString() === movieId.toString())
    );
  }

  await theatre.save();
  return theatre;
};
