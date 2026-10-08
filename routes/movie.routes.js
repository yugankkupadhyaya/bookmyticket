import express from 'express';
import { createMovie } from '../controllers/movie.controller.js';

const movieRoutes = express.Router();

movieRoutes.post('/mba/api/v1/movies', createMovie);

export default movieRoutes;
