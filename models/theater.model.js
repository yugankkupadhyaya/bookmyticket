import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Theater = mongoose.model('Theater', theaterSchema);