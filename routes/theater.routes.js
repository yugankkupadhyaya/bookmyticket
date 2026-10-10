import express from 'express';
import {
  createTheaterController,
  getAllTheatersController,
  getTheaterByIdController,
  updateTheaterController,
  deleteTheaterController,
  getTheatersByFilterController,
} from '../controllers/theater.controller.js';
import { validateTheaterRequestMiddleware } from '../middlewares/theater.middleware.js';

const theaterRouter = express.Router();

theaterRouter.post('/', validateTheaterRequestMiddleware, createTheaterController);
theaterRouter.get('/filter', getTheatersByFilterController);
theaterRouter.get('/', getAllTheatersController);
theaterRouter.get('/:id', getTheaterByIdController);
theaterRouter.put('/:id', validateTheaterRequestMiddleware, updateTheaterController);
theaterRouter.delete('/:id', deleteTheaterController);

export default theaterRouter;