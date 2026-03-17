const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    therapy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapy',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // HH:MM format
      required: true,
    },
    endTime: {
      type: String, // calculated from therapy duration
    },
    duration: Number, // in minutes
    status: {
      type: String,
      enum: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    notes: String,
    completedAt: Date,
    doctorNotes: String,
    therapistNotes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
