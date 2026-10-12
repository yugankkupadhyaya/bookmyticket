import prisma from '../lib/prisma.js';
import { filterByFuzzyField } from '../utils/fuzzy-search.js';
import { paginationMeta } from '../utils/pagination.js';
import { isValidId } from '../utils/ids.js';

const theatreInclude = { movies: { include: { movie: true } } };

const formatTheatre = (theatre) => ({
  ...theatre,
  movies: (theatre.movies || []).map((link) => link.movie || link.movieId),
});

export const createTheatre = async (data) => prisma.theatre.create({
  data: {
    name: data.name,
    description: data.description,
    pincode: data.pincode,
    address: data.address,
    city: data.city,
    rating: data.rating ?? 0,
  },
});

export const fetchTheatres = async (page = 1, limit = 10) => {
  const theatres = await prisma.theatre.findMany({ orderBy: { id: 'asc' }, include: theatreInclude });
  const skip = (page - 1) * limit;
  return {
    theatres: theatres.slice(skip, skip + limit).map(formatTheatre),
    pagination: paginationMeta(page, limit, theatres.length),
  };
};

export const getTheatreById = async (id) => {
  if (!isValidId(id)) return null;
  const theatre = await prisma.theatre.findUnique({ where: { id }, include: theatreInclude });
  return theatre ? formatTheatre(theatre) : null;
};

export const updateTheatre = async (id, data) => {
  if (!isValidId(id) || !(await prisma.theatre.findUnique({ where: { id } }))) return null;
  return prisma.theatre.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      pincode: data.pincode,
      address: data.address,
      city: data.city,
      rating: data.rating,
    },
    include: theatreInclude,
  }).then(formatTheatre);
};

export const deleteTheatre = async (id) => {
  if (!isValidId(id)) return null;
  try {
    return await prisma.theatre.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

export const fetchTheatresByFilter = async (query, page = 1, limit = 10) => {
  const where = query.pincode ? { pincode: Number(query.pincode) } : undefined;
  let theatres = await prisma.theatre.findMany({ where, orderBy: { id: 'asc' }, include: theatreInclude });
  if (query.city) theatres = filterByFuzzyField(theatres, 'city', query.city);
  if (query.name) theatres = filterByFuzzyField(theatres, 'name', query.name);
  const skip = (page - 1) * limit;
  return {
    theatres: theatres.slice(skip, skip + limit).map(formatTheatre),
    pagination: paginationMeta(page, limit, theatres.length),
  };
};

export const searchTheatres = async (searchTerm, page = 1, limit = 10) => {
  const normalizedSearchTerm = String(searchTerm ?? '').trim();
  if (!normalizedSearchTerm) return { err: 'Search query is required', code: 400 };
  const theatres = await prisma.theatre.findMany({ orderBy: { id: 'asc' }, include: theatreInclude });
  const nameMatches = new Set(filterByFuzzyField(theatres, 'name', normalizedSearchTerm).map((theatre) => theatre.id));
  const cityMatches = new Set(filterByFuzzyField(theatres, 'city', normalizedSearchTerm).map((theatre) => theatre.id));
  const matchedTheatres = theatres.filter((theatre) =>
    nameMatches.has(theatre.id) || cityMatches.has(theatre.id) || String(theatre.pincode) === normalizedSearchTerm,
  );
  const skip = (page - 1) * limit;
  return {
    theatres: matchedTheatres.slice(skip, skip + limit).map(formatTheatre),
    pagination: paginationMeta(page, limit, matchedTheatres.length),
  };
};

export const fetchTheatresByRating = async (minRating, page = 1, limit = 10) => {
  const theatres = await prisma.theatre.findMany({
    where: { rating: { gte: Number(minRating) } },
    orderBy: { id: 'asc' },
    include: theatreInclude,
  });
  const skip = (page - 1) * limit;
  return {
    theatres: theatres.slice(skip, skip + limit).map(formatTheatre),
    pagination: paginationMeta(page, limit, theatres.length),
  };
};

export const updateMovieInTheatre = async (theatreId, movieIds, insert) => {
  if (!isValidId(theatreId)) throw new Error('Theatre not found');
  if (!(await prisma.theatre.findUnique({ where: { id: theatreId } }))) throw new Error('Theatre not found');
  const ids = [...new Set(movieIds.map((id) => id.toString()))];
  const movies = await prisma.movie.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (movies.length !== ids.length) throw new Error('One or more movies not found');

  if (insert) {
    await prisma.movieTheatre.createMany({
      data: ids.map((movieId) => ({ movieId, theatreId })),
      skipDuplicates: true,
    });
  } else {
    await prisma.movieTheatre.deleteMany({ where: { theatreId, movieId: { in: ids } } });
  }
  return getTheatreById(theatreId);
};

export const fetchMoviesByTheatre = async (theatreId, page = 1, limit = 10) => {
  const theatre = await prisma.theatre.findUnique({ where: { id: theatreId }, include: theatreInclude });
  if (!theatre) return { err: 'Theatre not found', code: 404 };
  const allMovies = theatre.movies.map((link) => link.movie);
  const skip = (page - 1) * limit;
  return {
    movies: allMovies.slice(skip, skip + limit),
    pagination: paginationMeta(page, limit, allMovies.length),
  };
};

export const checkMovieInTheatre = async (theatreId, movieId) => {
  if (!isValidId(theatreId) || !isValidId(movieId)) {
    return { err: 'Invalid theatre or movie ID', code: 400 };
  }

  const [theatre, movie] = await Promise.all([
    prisma.theatre.findUnique({ where: { id: theatreId }, select: { id: true } }),
    prisma.movie.findUnique({ where: { id: movieId }, select: { id: true } }),
  ]);

  if (!theatre) return { err: 'Theatre not found', code: 404 };
  if (!movie) return { err: 'Movie not found', code: 404 };

  const relationship = await prisma.movieTheatre.findUnique({
    where: {
      movieId_theatreId: { movieId, theatreId },
    },
  });

  return {
    theatreId,
    movieId,
    available: Boolean(relationship),
  };
};
