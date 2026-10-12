import express from 'express';
import {
  createTheatreController,
  getAllTheatresController,
  getTheatreByIdController,
  updateTheatreController,
  deleteTheatreController,
  getTheatresByFilterController,
  searchTheatresController,
  getTheatresByRatingController,
  updateMovieInTheatreController,
  getMoviesByTheatreController,
  checkMovieInTheatreController,
} from '../controllers/theatre.controller.js';
import {
  validateMovieUpdateRequestMiddleware,
  validateTheatreRequestMiddleware,
} from '../middlewares/theatre.middleware.js';

const theatreRouter = express.Router();

theatreRouter.post('/', validateTheatreRequestMiddleware, createTheatreController);
theatreRouter.get('/search', searchTheatresController);
theatreRouter.get('/filter', getTheatresByFilterController);
theatreRouter.get('/rating', getTheatresByRatingController);
theatreRouter.get('/', getAllTheatresController);
theatreRouter.patch(
  '/:id/movies',
  validateMovieUpdateRequestMiddleware,
  updateMovieInTheatreController
);
theatreRouter.get('/:id/movies/:movieId', checkMovieInTheatreController);
theatreRouter.get('/:id/movies', getMoviesByTheatreController);
theatreRouter.get('/:id', getTheatreByIdController);
theatreRouter.put('/:id', validateTheatreRequestMiddleware, updateTheatreController);
theatreRouter.delete('/:id', deleteTheatreController);

export default theatreRouter;
``
