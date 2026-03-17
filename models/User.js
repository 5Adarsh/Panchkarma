const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // don't return password by default
    },
    role: {
      type: String,
      enum: ['CLIENT', 'DOCTOR', 'THERAPIST', 'MANAGER'],
      default: 'CLIENT',
    },
    // Common fields
    age: Number,
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    bloodGroup: String,
    healthConditions: [String],
    allergies: [String],

    // Doctor/Therapist fields
    specialization: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    bio: String,
    isActive: {
      type: Boolean,
      default: true,
    },

    // Client fields
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedTherapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
