import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import prisma from '../lib/prisma.js';
import Movie from '../models/movie.model.js';
import { Theatre } from '../models/theatre.model.js';

const mongoUrl = process.env.DB_URL || `mongodb://localhost:27017/${process.env.DB_NAME || 'mba_db'}`;

const toId = (value) => value?.toString();

const migrate = async () => {
  await prisma.$connect();
  await mongoose.connect(mongoUrl);

  const [existingMovies, existingTheatres] = await Promise.all([
    prisma.movie.count(),
    prisma.theatre.count(),
  ]);

  if (existingMovies > 0 || existingTheatres > 0) {
    throw new Error('PostgreSQL already contains movies or theatres; refusing to duplicate data');
  }

  const [mongoMovies, mongoTheatres] = await Promise.all([
    Movie.find().lean(),
    Theatre.find().lean(),
  ]);

  const movieIdMap = new Map(
    mongoMovies.map((movie) => [toId(movie._id), randomUUID()]),
  );
  const theatreIdMap = new Map(
    mongoTheatres.map((theatre) => [toId(theatre._id), randomUUID()]),
  );

  await prisma.movie.createMany({
    data: mongoMovies.map((movie) => ({
      id: movieIdMap.get(toId(movie._id)),
      name: movie.name,
      description: movie.description || '',
      casts: Array.isArray(movie.casts) ? movie.casts : [],
      trailerUrl: movie.trailerUrl || '',
      language: movie.language || 'English',
      releaseStatus: movie.releaseStatus || 'Released',
      createdAt: movie.createdAt || new Date(),
      updatedAt: movie.updatedAt || new Date(),
    })),
  });

  await prisma.theatre.createMany({
    data: mongoTheatres.map((theatre) => ({
      id: theatreIdMap.get(toId(theatre._id)),
      name: theatre.name,
      description: theatre.description || null,
      pincode: theatre.pincode,
      address: theatre.address,
      city: theatre.city,
      rating: theatre.rating ?? 0,
      createdAt: theatre.createdAt || new Date(),
      updatedAt: theatre.updatedAt || new Date(),
    })),
  });

  const links = new Map();
  const addLink = (movieId, theatreId) => {
    const newMovieId = movieIdMap.get(movieId);
    const newTheatreId = theatreIdMap.get(theatreId);
    if (newMovieId && newTheatreId) {
      links.set(`${newMovieId}:${newTheatreId}`, { movieId: newMovieId, theatreId: newTheatreId });
    }
  };

  for (const theatre of mongoTheatres) {
    for (const movieId of theatre.movies || []) {
      addLink(toId(movieId), toId(theatre._id));
    }
  }

  for (const movie of mongoMovies) {
    for (const theatreId of movie.theatres || []) {
      addLink(toId(movie._id), toId(theatreId));
    }
  }

  if (links.size > 0) {
    await prisma.movieTheatre.createMany({ data: [...links.values()] });
  }

  console.log(JSON.stringify({
    movies: mongoMovies.length,
    theatres: mongoTheatres.length,
    relationships: links.size,
    movieIdMap: Object.fromEntries(movieIdMap),
    theatreIdMap: Object.fromEntries(theatreIdMap),
  }, null, 2));
};

try {
  await migrate();
} finally {
  await mongoose.disconnect();
  await prisma.$disconnect();
}
