const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Therapy = require('../models/Therapy');
const DoshaStatus = require('../models/DoshaStatus');

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.session.user.id;

    const appointmentCount = await Appointment.countDocuments({
      client: userId,
      status: 'COMPLETED',
    });

    const upcomingCount = await Appointment.countDocuments({
      client: userId,
      status: { $in: ['SCHEDULED', 'CONFIRMED'] },
    });

    const nextAppointment = await Appointment.findOne({
      client: userId,
      status: { $in: ['SCHEDULED', 'CONFIRMED'] },
    })
      .populate('therapy')
      .populate('doctor', 'firstName lastName')
      .sort({ appointmentDate: 1 });

    const doshaStatus = await DoshaStatus.findOne({ client: userId }).sort({
      recordedAt: -1,
    });

    const recentAppointments = await Appointment.find({ client: userId })
      .populate('therapy')
      .sort({ appointmentDate: -1 })
      .limit(5);

    res.render('client/dashboard', {
      title: 'Client Dashboard',
      user: req.session.user,
      appointmentCount,
      upcomingCount,
      nextAppointment,
      doshaStatus,
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const status = req.query.status || 'ALL';

    let query = { client: userId };
    if (status !== 'ALL') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('therapy')
      .populate('doctor', 'firstName lastName')
      .sort({ appointmentDate: -1 });

    res.render('client/appointments', {
      title: 'My Appointments',
      user: req.session.user,
      appointments,
      currentStatus: status,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookTherapy = async (req, res, next) => {
  try {
    const therapies = await Therapy.find();
    const doctors = await User.find({role:'DOCTOR'});
    const user = await User.findById(req.session.user.id);
    // console.log(doctors);
    res.render('client/book_therapy', {
      title: 'Book Therapy',
      user: req.session.user,
      therapies,
      assignedDoctor: user.assignedDoctor,
      doctors
    });
  } catch (error) {
    next(error);
  }
};
exports.postBookTherapy = async (req, res, next) => {
  try {
    const { therapyId, appointmentDate, startTime, doctor, notes } = req.body;

    const therapy = await Therapy.findById(therapyId);
    if (!therapy) {
      return res.status(404).render('client/book_therapy', {
        title: 'Book Therapy',
        user: req.session.user,
        message: 'Therapy not found',
      });
    }

    if (!doctor) {
      return res.status(400).render('client/book_therapy', {
        title: 'Book Therapy',
        user: req.session.user,
        message: 'Please select a doctor',
      });
    }

    await Appointment.create({
      client: req.session.user.id,
      therapy: therapyId,
      doctor,
      appointmentDate,
      startTime,
      duration: therapy.duration,
      notes,
      status: 'SCHEDULED',
    });

    // ✅ IMPORTANT: redirect, don't render directly
    return res.redirect('/client/appointments?success=Appointment+booked+successfully');
  } catch (error) {
    next(error);
  }
};

exports.getDoshaTracker = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const period = parseInt(req.query.period || '30'); // days

    // Date filter for selected period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // History within selected period
    const doshaHistory = await DoshaStatus.find({
      client: userId,
      recordedAt: { $gte: startDate },
    })
      .sort({ recordedAt: -1 });

    let currentDosha;

    if (doshaHistory.length > 0) {
      // Use latest record in range
      currentDosha = {
        vata: doshaHistory[0].vata,
        pitta: doshaHistory[0].pitta,
        kapha: doshaHistory[0].kapha,
      };
    } else {
      // No records in this period – check full history
      const fullHistory = await DoshaStatus.find({ client: userId });

      if (fullHistory.length > 0) {
        const total = fullHistory.length;

        const avgVata =
          fullHistory.reduce((sum, rec) => sum + rec.vata, 0) / total;
        const avgPitta =
          fullHistory.reduce((sum, rec) => sum + rec.pitta, 0) / total;
        const avgKapha =
          fullHistory.reduce((sum, rec) => sum + rec.kapha, 0) / total;

        currentDosha = {
          vata: Math.round(avgVata),
          pitta: Math.round(avgPitta),
          kapha: Math.round(avgKapha),
        };
      } else {
        // No records at all – default balanced
        currentDosha = { vata: 33, pitta: 33, kapha: 34 };
      }
    }

    res.render('client/dosha_tracker', {
      title: 'Dosha Tracker',
      user: req.session.user,
      currentDosha,
      doshaHistory,
      period: period.toString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id);

    res.render('client/profile', {
      title: 'My Profile',
      user: req.session.user,
      profile: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const {
      firstName,
      lastName,
      phone,
      age,
      gender,
      bloodGroup,
      healthConditions,
      allergies,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
        age,
        gender,
        bloodGroup,
        healthConditions: healthConditions
          ? healthConditions.split(',').map((s) => s.trim())
          : [],
        allergies: allergies
          ? allergies.split(',').map((s) => s.trim())
          : [],
      },
      { new: true }
    );

    // update session name so navbar shows updated name
    req.session.user.firstName = user.firstName;
    req.session.user.lastName = user.lastName;

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect('/client/profile');
    });
  } catch (error) {
    next(error);
  }
};
