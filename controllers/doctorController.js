const Appointment = require('../models/Appointment');
const User = require('../models/User');
const DoshaStatus = require('../models/DoshaStatus');

exports.getDashboard = async (req, res, next) => {
  try {
    const doctorId = req.session.user.id;

    const patientsCount = await User.countDocuments({
      assignedDoctor: doctorId,
    });

    const appointmentsToday = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    })
      .populate('client', 'firstName lastName')
      .populate('therapy');

    const upcomingAppointments = await Appointment.find({
      doctor: doctorId,
      status: { $in: ['SCHEDULED', 'CONFIRMED'] },
      appointmentDate: { $gte: new Date() },
    })
      .populate('client', 'firstName lastName')
      .populate('therapy')
      .sort({ appointmentDate: 1 })
      .limit(5);

    res.render('doctor/dashboard', {
      title: 'Doctor Dashboard',
      user: req.session.user,
      patientsCount,
      appointmentsToday,
      upcomingAppointments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const doctorId = req.session.user.id;
    const status = req.query.status || 'ALL';

    let query = { doctor: doctorId };
    if (status !== 'ALL') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'firstName lastName email')
      .populate('therapy')
      .sort({ appointmentDate: -1 });

    res.render('doctor/appointments', {
      title: 'Appointments',
      user: req.session.user,
      appointments,
      currentStatus: status,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const doctorId = req.session.user.id;

    const patients = await User.find({
      assignedDoctor: doctorId,
    }).select('firstName lastName email phone age gender createdAt');

    res.render('doctor/patient_list', {
      title: 'My Patients',
      user: req.session.user,
      patients,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientDetail = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findById(patientId);
    const appointments = await Appointment.find({
      client: patientId,
    })
      .populate('therapy')
      .sort({ appointmentDate: -1 });

    const doshaHistory = await DoshaStatus.find({ client: patientId }).sort({
      recordedAt: -1,
    });

    res.render('doctor/patient_detail', {
      title: 'Patient Details',
      user: req.session.user,
      patient,
      appointments,
      doshaHistory,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDoshaForm = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findById(patientId);

    res.render('doctor/dosha_form', {
      title: 'Record Dosha Status',
      user: req.session.user,
      patient,
    });
  } catch (error) {
    next(error);
  }
};

exports.postDoshaForm = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { vata, pitta, kapha, notes } = req.body;

    const doshas = {
      vata: parseInt(vata),
      pitta: parseInt(pitta),
      kapha: parseInt(kapha),
    };

    const dominantDosha = Object.keys(doshas).reduce((a, b) => (doshas[a] > doshas[b] ? a : b));

    await DoshaStatus.create({
      client: patientId,
      vata: doshas.vata,
      pitta: doshas.pitta,
      kapha: doshas.kapha,
      dominantDosha: dominantDosha.toUpperCase(),
      notes,
      recordedBy: req.session.user.id,
    });

    res.redirect(`/doctor/patient/${patientId}`);
  } catch (error) {
    next(error);
  }
};

exports.confirmAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'CONFIRMED',
    });

    res.redirect('/doctor/appointments');
  } catch (error) {
    next(error);
  }
};

exports.completeAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'COMPLETED',
      doctorNotes: notes,
      completedAt: new Date(),
    });

    res.redirect('/doctor/appointments');
  } catch (error) {
    next(error);
  }
};
