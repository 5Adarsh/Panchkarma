const mongoose = require('mongoose');

const TherapySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a therapy name'],
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    benefits: [String],
    doshas: {
      type: [String], // VATA, PITTA, KAPHA
      enum: ['VATA', 'PITTA', 'KAPHA'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapy', TherapySchema);
