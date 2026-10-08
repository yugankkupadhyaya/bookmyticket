import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    casts: {
      type: [String],
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    releaseStatus: {
      type: String,
      required: true,
      default: 'Released',
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
