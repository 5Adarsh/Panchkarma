const roles = {
  CLIENT: 'CLIENT',
  DOCTOR: 'DOCTOR',
  THERAPIST: 'THERAPIST',
  MANAGER: 'MANAGER',
};

const appointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const therapyDurations = [30, 45, 60, 90];

const doshas = {
  VATA: 'VATA',
  PITTA: 'PITTA',
  KAPHA: 'KAPHA',
};

const therapyTypes = [
  { name: 'Abhyanga', description: 'Full body oil massage' },
  { name: 'Shirodhara', description: 'Medicated oil dripping on forehead' },
  { name: 'Nasya', description: 'Nasal administration of medications' },
  { name: 'Basti', description: 'Therapeutic enema' },
  { name: 'Vamana', description: 'Therapeutic emesis' },
  { name: 'Virechana', description: 'Purgation therapy' },
  { name: 'Consultation', description: 'Doctor consultation' },
];

module.exports = {
  roles,
  appointmentStatus,
  therapyDurations,
  doshas,
  therapyTypes,
};
