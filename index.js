import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import movieRouter from './routes/movie.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'mba_db';
const DB_URL = process.env.DB_URL || `mongodb://localhost:27017/${DB_NAME}`;

app.use(express.json());

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to MongoDB: ${DB_NAME}`))
  .catch((err) => console.error('MongoDB connection error:', err));

console.log('Registering movie routes...');
app.use(movieRouter);
console.log('Movie routes registered!');

app.get('/', (req, res) => {
  res.send('BookMyTicket server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
