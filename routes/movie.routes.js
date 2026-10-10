import express from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  deleteMovieById,
  updateMovieById,
  getMoviesByFilter,
} from '../controllers/movie.controller.js';
import { validateMovieRequestMiddleware } from '../middlewares/movie.middleware.js';
const movieRouter = express.Router();

movieRouter.post('/', validateMovieRequestMiddleware, createMovie);
movieRouter.get('/filter', getMoviesByFilter);
movieRouter.get('/', getAllMovies);

movieRouter.get('/:id', getMovieById);

movieRouter.put('/:id', validateMovieRequestMiddleware, updateMovieById);

movieRouter.delete('/:id', deleteMovieById);

export default movieRouter;
