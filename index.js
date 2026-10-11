import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import movieRouter from './routes/movie.routes.js';
import theatreRouter from './routes/theatre.routes.js';
import { apiRateLimiter, connectRedis } from './middlewares/rate-limit.middleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'mba_db';
const DB_URL = process.env.DB_URL || `mongodb://localhost:27017/${DB_NAME}`;

app.use(express.json());
app.use('/mba/api/v1', apiRateLimiter);

app.use('/mba/api/v1/movies', movieRouter);
app.use('/mba/api/v1/theatres', theatreRouter);
app.get('/', (req, res) => {
  res.send('BookMyTicket server is running');
});

const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to MongoDB: ${DB_NAME}`);

    await connectRedis();
    console.log('Connected to Redis');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Application startup error:', error);
    process.exitCode = 1;
  }
};

startServer();
