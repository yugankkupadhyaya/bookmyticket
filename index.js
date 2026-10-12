import express from 'express';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';

import movieRouter from './routes/movie.routes.js';
import theatreRouter from './routes/theatre.routes.js';
import { apiRateLimiter, connectRedis } from './middlewares/rate-limit.middleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/mba/api/v1', apiRateLimiter);

app.use('/mba/api/v1/movies', movieRouter);
app.use('/mba/api/v1/theatres', theatreRouter);
app.get('/', (req, res) => {
  res.send('BookMyTicket server is running');
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

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
