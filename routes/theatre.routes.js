import express from 'express';
import {
  createTheatreController,
  getAllTheatresController,
  getTheatreByIdController,
  updateTheatreController,
  deleteTheatreController,
  getTheatresByFilterController,
  getTheatresByRatingController,
} from '../controllers/theatre.controller.js';
import { validateTheatreRequestMiddleware } from '../middlewares/theatre.middleware.js';

const theatreRouter = express.Router();

theatreRouter.post('/', validateTheatreRequestMiddleware, createTheatreController);
theatreRouter.get('/filter', getTheatresByFilterController);
theatreRouter.get('/rating', getTheatresByRatingController);
theatreRouter.get('/', getAllTheatresController);
theatreRouter.get('/:id', getTheatreByIdController);
theatreRouter.put('/:id', validateTheatreRequestMiddleware, updateTheatreController);
theatreRouter.delete('/:id', deleteTheatreController);

export default theatreRouter;
