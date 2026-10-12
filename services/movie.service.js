import prisma from '../lib/prisma.js';
import { filterByFuzzyField } from '../utils/fuzzy-search.js';
import { paginationMeta } from '../utils/pagination.js';
import { isValidId } from '../utils/ids.js';

const movieInclude = { theatres: { include: { theatre: true } } };

const formatMovie = (movie) => ({
  ...movie,
  theatres: (movie.theatres || []).map((link) => link.theatre || link.theatreId),
});

export const createMovie = async (data) => prisma.movie.create({
  data: {
    name: data.name,
    description: data.description,
    casts: data.casts || [],
    trailerUrl: data.trailerUrl,
    language: data.language,
    releaseStatus: data.releaseStatus,
  },
});

export const getMovieByIdService = async (id) => {
  if (!isValidId(id)) return { err: 'Movie not found', code: 404 };
  const movie = await prisma.movie.findUnique({ where: { id }, include: movieInclude });
  return movie ? formatMovie(movie) : { err: 'Movie not found', code: 404 };
};

export const updateMovie = async (id, data) => {
  if (!isValidId(id) || !(await prisma.movie.findUnique({ where: { id } }))) return null;
  const { theatres, ...movieData } = data;
  return prisma.movie.update({
    where: { id },
    data: movieData,
    include: movieInclude,
  }).then(formatMovie);
};

export const deleteMovie = async (id) => {
  if (!isValidId(id)) return null;
  try {
    return await prisma.movie.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

export const fetchTheatresByMovie = async (movieId, page = 1, limit = 10) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId }, include: movieInclude });
  if (!movie) return { err: 'Movie not found', code: 404 };
  const allTheatres = movie.theatres.map((link) => link.theatre);
  const skip = (page - 1) * limit;
  return {
    theatres: allTheatres.slice(skip, skip + limit),
    pagination: paginationMeta(page, limit, allTheatres.length),
  };
};

export const fetchMovies = async (filter = {}, page = 1, limit = 10) => {
  const movieId = filter.movieId || filter.id;
  let movies;

  if (movieId) {
    if (!isValidId(movieId)) return { err: 'Invalid movie ID', code: 400 };
    movies = await prisma.movie.findMany({ where: { id: movieId }, include: movieInclude });
  } else {
    movies = await prisma.movie.findMany({ orderBy: { id: 'asc' }, include: movieInclude });
  }

  const searchTerm = filter.name || filter.q;
  const filteredMovies = searchTerm ? filterByFuzzyField(movies, 'name', searchTerm) : movies;
  if (filteredMovies.length === 0) return { err: 'No movies found', code: 404 };

  const skip = (page - 1) * limit;
  return {
    movies: filteredMovies.slice(skip, skip + limit).map(formatMovie),
    pagination: paginationMeta(page, limit, filteredMovies.length),
  };
};

export const fetchMoviesWithTheatres = (filter = {}, page = 1, limit = 10) =>
  fetchMovies(filter, page, limit);
