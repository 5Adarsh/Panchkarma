// controllers/therapistController.js
const Appointment = require('../models/Appointment');

exports.getDashboard = async (req, res, next) => {
  try {
    const therapistId = req.session.user && req.session.user.id;
    if (!therapistId) return res.redirect('/auth/login');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySessions = await Appointment.find({
      therapist: therapistId,
      appointmentDate: { $gte: startOfDay, $lt: endOfDay },
    })
      .populate('client', 'firstName lastName')
      .populate('therapy')
      .sort({ startTime: 1 });

    const completedCount = await Appointment.countDocuments({
      therapist: therapistId,
      status: 'COMPLETED',
    });

    const upcomingSessions = await Appointment.find({
      therapist: therapistId,
      status: { $in: ['SCHEDULED', 'CONFIRMED'] },
      appointmentDate: { $gte: new Date() },
    })
      .populate('client', 'firstName lastName')
      .populate('therapy')
      .sort({ appointmentDate: 1 })
      .limit(10);

    res.render('therapist/dashboard', {
      title: 'Therapist Dashboard',
      user: req.session.user,
      todaySessions,
      completedCount,
      upcomingSessions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodaySessions = async (req, res, next) => {
  try {
    const therapistId = req.session.user && req.session.user.id;
    if (!therapistId) return res.redirect('/auth/login');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Appointment.find({
      therapist: therapistId,
      appointmentDate: { $gte: startOfDay, $lt: endOfDay },
    })
      .populate('client', 'firstName lastName email phone')
      .populate('therapy')
      .sort({ startTime: 1 });

    res.render('therapist/today_sessions', {
      title: "Today's Sessions",
      user: req.session.user,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSessionDetail = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Appointment.findById(sessionId)
      .populate('client')
      .populate('therapy')
      .populate('doctor', 'firstName lastName');

    if (!session) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Session not found',
        status: 404,
      });
    }

    res.render('therapist/session_detail', {
      title: 'Session Details',
      user: req.session.user,
      session,
    });
  } catch (error) {
    next(error);
  }
};

exports.completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { notes } = req.body;

    await Appointment.findByIdAndUpdate(sessionId, {
      status: 'COMPLETED',
      therapistNotes: notes,
      completedAt: new Date(),
    });

    res.redirect('/therapist/today-sessions');
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingAppointments = async (req, res, next) => {
  try {
    const therapistId = req.session.user && req.session.user.id;
    if (!therapistId) return res.redirect('/auth/login');

    const appointments = await Appointment.find({
      therapist: therapistId,
      status: { $in: ['SCHEDULED', 'CONFIRMED'] },
      appointmentDate: { $gte: new Date() },
    })
      .populate('client', 'firstName lastName')
      .populate('therapy')
      .sort({ appointmentDate: 1 });

    console.log('Therapist upcoming appointments:', appointments.length);

    res.render('therapist/upcoming_appointments', {
      title: 'Upcoming Appointments',
      user: req.session.user,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};
