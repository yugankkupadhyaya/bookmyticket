import { errorResponse } from '../utils/response.js';

const requiredMovieFields = [
  'name',
  'description',
  'trailerUrl',
  'language',
  'releaseStatus',
];

export const validateMovieRequestMiddleware = (req, res, next) => {
  const errors = {};
  const body = req.body ?? {};

  for (const field of requiredMovieFields) {
    if (typeof body[field] !== 'string' || body[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errorResponse('Validation failed', errors));
  }

  next();
};
