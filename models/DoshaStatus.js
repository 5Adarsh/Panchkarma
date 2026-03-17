const mongoose = require('mongoose');

const DoshaStatusSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vata: {
      type: Number, // percentage 0-100
      default: 0,
    },
    pitta: {
      type: Number,
      default: 0,
    },
    kapha: {
      type: Number,
      default: 0,
    },
    dominantDosha: {
      type: String,
      enum: ['VATA', 'PITTA', 'KAPHA'],
    },
    notes: String,
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Doctor who recorded this
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DoshaStatus', DoshaStatusSchema);
