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

movieRouter.post('/mba/api/v1/movies', validateMovieRequestMiddleware, createMovie);
movieRouter.get('/mba/api/v1/movies/filter', getMoviesByFilter);
movieRouter.get('/mba/api/v1/movies', getAllMovies);

movieRouter.get('/mba/api/v1/movies/:id', getMovieById);

movieRouter.put('/mba/api/v1/movies/:id', validateMovieRequestMiddleware, updateMovieById);

movieRouter.delete('/mba/api/v1/movies/:id', deleteMovieById);

export default movieRouter;
