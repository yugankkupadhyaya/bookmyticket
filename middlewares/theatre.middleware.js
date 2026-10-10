import { errorResponse } from '../utils/response.js';

const requiredTheatreFields = [
  'name',
  'pincode',
  'address',
  'city',
];

export const validateTheatreRequestMiddleware = (req, res, next) => {
  const errors = {};
  const body = req.body ?? {};

  for (const field of requiredTheatreFields) {
    if (field === 'pincode') {
      if (typeof body[field] !== 'number' || isNaN(body[field])) {
        errors[field] = `${field} is required and must be a number`;
      }
    } else if (typeof body[field] !== 'string' || body[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  }

  if (
    body.rating !== undefined &&
    (typeof body.rating !== 'number' || !Number.isFinite(body.rating) || body.rating < 0 || body.rating > 5)
  ) {
    errors.rating = 'rating must be a number between 0 and 5';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errorResponse('Validation failed', errors));
  }

  next();
};
