const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.getRegister = (req, res) => {
  res.render('auth/register_client', { title: 'Register' });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('auth/login', {
        message: 'Please provide email and password',
        title: 'Login',
      });
    }

    console.log(email);
    
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !( user.matchPassword(password))) {
        return res.status(401).render('auth/login', {
            message: 'Invalid email or password',
            title: 'Login',
        });
    }

    // Create session
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      // Redirect based on role
      switch (user.role) {
        case 'DOCTOR':
          return res.redirect('/doctor/dashboard');
        case 'THERAPIST':
          return res.redirect('/therapist/dashboard');
        case 'MANAGER':
          return res.redirect('/manager/dashboard');
        default:
          return res.redirect('/client/dashboard');
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, passwordConfirm } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !passwordConfirm) {
      return res.status(400).render('auth/register_client', {
        message: 'Please provide all required fields',
        title: 'Register',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).render('auth/register_client', {
        message: 'Passwords do not match',
        title: 'Register',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render('auth/register_client', {
        message: 'Email is already in use',
        title: 'Register',
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'CLIENT',
    });

    // Create session
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/client/dashboard');
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.redirect('/');
  });
};
