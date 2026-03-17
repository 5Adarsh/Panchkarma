const User = require('../models/User');
const Therapy = require('../models/Therapy');
const Appointment = require('../models/Appointment');

// Dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalTherapies = await Therapy.countDocuments();

    const completedAppointments = await Appointment.countDocuments({
      status: 'COMPLETED',
    });

    res.render('manager/dashboard', {
      title: 'Manager Dashboard',
      user: req.session.user,
      stats: {
        totalUsers,
        totalAppointments,
        totalTherapies,
        completedAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Users Management
exports.getUsers = async (req, res, next) => {
  try {
    const role = req.query.role || 'ALL';

    let query = {};
    if (role !== 'ALL') {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.render('manager/users', {
      title: 'Manage Users',
      user: req.session.user,
      users,
      currentRole: role,
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, role, password, specialization } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render('manager/users', {
        message: 'Email already exists',
        title: 'Manage Users',
      });
    }

    await User.create({
      firstName,
      lastName,
      email,
      phone,
      role,
      password,
      specialization: role !== 'CLIENT' ? specialization : null,
    });

    res.redirect('/manager/users');
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, isActive, specialization } = req.body;

    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      phone,
      isActive,
      specialization,
    });

    res.redirect('/manager/users');
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.redirect('/manager/users');
  } catch (error) {
    next(error);
  }
};

// Therapies Management
exports.getTherapies = async (req, res, next) => {
  try {
    const therapies = await Therapy.find().sort({ createdAt: -1 });

    res.render('manager/therapies', {
      title: 'Manage Therapies',
      user: req.session.user,
      therapies,
    });
  } catch (error) {
    next(error);
  }
};

exports.createTherapy = async (req, res, next) => {
  try {
    const { name, description, duration, price, benefits, doshas } = req.body;

    await Therapy.create({
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
      benefits: benefits ? benefits.split(',') : [],
      doshas: doshas? doshas.toUpperCase().split(',').map(d => d.trim()): [],
    });

    res.redirect('/manager/therapies');
  } catch (error) {
    next(error);
  }
};

exports.updateTherapy = async (req, res, next) => {
  try {
    const { therapyId } = req.params;
    const { name, description, duration, price, benefits, doshas, isActive } = req.body;

    await Therapy.findByIdAndUpdate(therapyId, {
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
      benefits: benefits ? benefits.split(',') : [],
      doshas: doshas ? doshas.split(',') : [],
      isActive,
    });

    res.redirect('/manager/therapies');
  } catch (error) {
    next(error);
  }
};

exports.deleteTherapy = async (req, res, next) => {
  try {
    const { therapyId } = req.params;

    await Therapy.findByIdAndDelete(therapyId);

    res.redirect('/manager/therapies');
  } catch (error) {
    next(error);
  }
};

// Appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const status = req.query.status || 'ALL';

    let query = {};
    if (status !== 'ALL') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'firstName lastName')
      .populate('therapy')
      .populate('doctor', 'firstName lastName')
      .sort({ appointmentDate: -1 });

    res.render('manager/appointments', {
      title: 'All Appointments',
      user: req.session.user,
      appointments,
      currentStatus: status,
    });
  } catch (error) {
    next(error);
  }
};

// Reports
exports.getReports = async (req, res, next) => {
  try {
    const period = req.query.period || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const appointmentsByTherapy = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$therapy',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'therapies',
          localField: '_id',
          foreignField: '_id',
          as: 'therapyInfo',
        },
      },
    ]);

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    res.render('manager/reports', {
      title: 'Reports & Analytics',
      user: req.session.user,
      appointmentsByStatus,
      appointmentsByTherapy,
      usersByRole,
      period,
    });
  } catch (error) {
    next(error);
  }
};
