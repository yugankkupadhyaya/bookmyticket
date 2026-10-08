import express from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  deleteMovieById,
} from '../controllers/movie.controller.js';

const movieRoutes = express.Router();

movieRoutes.post('/mba/api/v1/movies', createMovie);

movieRoutes.get('/mba/api/v1/movies', getAllMovies);

movieRoutes.get('/mba/api/v1/movies/:id', getMovieById);

movieRoutes.delete('/mba/api/v1/movies/:id', deleteMovieById);

export default movieRoutes;
