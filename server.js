require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const methodOverride = require('method-override')

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Static files
app.use(express.static(path.join(__dirname,'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Method override to support PUT & DELETE from forms
app.use(methodOverride('_method'));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/client', require('./routes/clientRoutes'));
app.use('/doctor', require('./routes/doctorRoutes'));
app.use('/therapist', require('./routes/therapistRoutes'));
app.use('/manager', require('./routes/managerRoutes'));

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    // If logged in, redirect to dashboard based on role
    switch (req.session.user.role) {
      case 'DOCTOR':
        return res.redirect('/doctor/dashboard');
      case 'THERAPIST':
        return res.redirect('/therapist/dashboard');
      case 'MANAGER':
        return res.redirect('/manager/dashboard');
      default:
        return res.redirect('/client/dashboard');
    }
  }
  res.redirect('/auth/login');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).render('error', {
    message,
    status,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    status: 404,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌿 Panchkarma Clinic server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
