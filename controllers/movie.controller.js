import Movie from '../models/movie.model.js';
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    console.log('Movie created successfully:', movie);
    return res.status(201).json({
      success: true,
      error: {},
      data: movie,
      message: 'Movie created successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
      data: null,
      message: 'Error creating movie',
    });
  }
};
