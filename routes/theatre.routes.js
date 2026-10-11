import express from 'express';
import {
  createTheatreController,
  getAllTheatresController,
  getTheatreByIdController,
  updateTheatreController,
  deleteTheatreController,
  getTheatresByFilterController,
  getTheatresByRatingController,
  updateMovieInTheatreController,
} from '../controllers/theatre.controller.js';
import {
  validateMovieUpdateRequestMiddleware,
  validateTheatreRequestMiddleware,
} from '../middlewares/theatre.middleware.js';

const theatreRouter = express.Router();

theatreRouter.post('/', validateTheatreRequestMiddleware, createTheatreController);
theatreRouter.get('/filter', getTheatresByFilterController);
theatreRouter.get('/rating', getTheatresByRatingController);
theatreRouter.get('/', getAllTheatresController);
theatreRouter.patch(
  '/:id/movies',
  validateMovieUpdateRequestMiddleware,
  updateMovieInTheatreController
);
theatreRouter.get('/:id', getTheatreByIdController);
theatreRouter.put('/:id', validateTheatreRequestMiddleware, updateTheatreController);
theatreRouter.delete('/:id', deleteTheatreController);

export default theatreRouter;
