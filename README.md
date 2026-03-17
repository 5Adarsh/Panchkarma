# Panchkarma Clinic Management System

A comprehensive MVC-style web application for managing Panchkarma clinic operations with role-based access for Clients, Doctors, Therapists, and Managers.

## 🏗️ Project Structure

```
panchkarma-app/
├── config/               # Configuration files
│   └── db.js            # MongoDB connection
├── controllers/         # Business logic
│   ├── authController.js
│   ├── clientController.js
│   ├── doctorController.js
│   ├── therapistController.js
│   └── managerController.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorHandler.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Therapy.js
│   ├── Appointment.js
│   └── DoshaStatus.js
├── routes/              # Express routers
│   ├── authRoutes.js
│   ├── clientRoutes.js
│   ├── doctorRoutes.js
│   ├── therapistRoutes.js
│   └── managerRoutes.js
├── views/               # EJS templates
│   ├── layouts/         # Main layout
│   ├── partials/        # Reusable components
│   ├── auth/            # Login/Register
│   ├── client/          # Client pages
│   ├── doctor/          # Doctor pages
│   ├── therapist/       # Therapist pages
│   └── manager/         # Manager pages
├── public/              # Static assets
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── common.js
├── utils/               # Helper functions
│   ├── constants.js
│   ├── dateUtils.js
│   └── doshaUtils.js
├── server.js            # Express app entry point
├── package.json
├── .env                 # Environment variables
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. **Clone/Setup**
   ```bash
   cd panchkarma-app
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/panchkarma
   SESSION_SECRET=your_secret_key
   PORT=3000
   NODE_ENV=development
   ```

3. **Run Server**
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

4. **Access Application**
   - Navigate to `http://localhost:3000`
   - Login with demo credentials (see login page)

## 👥 User Roles

### Client
- Book therapy appointments
- View appointment history
- Track dosha balance
- Manage personal profile
- View notifications

### Doctor
- Manage patients
- View/confirm appointments
- Record dosha assessments
- Complete appointments with notes
- Monitor patient health history

### Therapist
- View assigned sessions
- Track today's sessions
- Complete sessions with notes
- Manage upcoming appointments

### Manager
- User management (CRUD)
- Therapy catalog management
- View all appointments
- Generate reports and analytics
- System statistics

## 🔐 Authentication

- Session-based authentication using `express-session`
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Login/Register for new clients

## 📊 Features

### Client Features
- **Dashboard**: Stats, next appointment, dosha balance
- **Appointments**: Book, view, cancel appointments
- **Book Therapy**: Select therapy, date, time, doctor
- **Dosha Tracker**: View dosha assessment history
- **Profile**: Update personal information

### Doctor Features
- **Dashboard**: Patient count, today's appointments
- **Appointments**: Manage and confirm appointments
- **Patients**: View patient list and details
- **Dosha Form**: Record dosha assessments
- **Patient History**: View patient appointments and assessments

### Therapist Features
- **Dashboard**: Quick overview of sessions
- **Today's Sessions**: View and manage sessions
- **Session Details**: Record notes and complete sessions
- **Upcoming**: View upcoming appointments

### Manager Features
- **Dashboard**: System statistics
- **Users**: CRUD operations for users
- **Therapies**: Manage therapy catalog
- **Appointments**: Global view of all appointments
- **Reports**: Analytics and usage reports

## 🎨 UI/UX

- **Responsive Design**: Mobile-first approach
- **Color Scheme**:
  - Primary: #667eea (Indigo)
  - Secondary: #764ba2 (Purple)
  - Success: #51cf66 (Green)
  - Danger: #ff6b6b (Red)
  - Warning: #ffa500 (Orange)

- **Components**:
  - Navigation bars (per role)
  - Stat cards
  - Tables with filtering
  - Forms with validation
  - Dosha cards with progress bars
  - Alert/Badge system

## 📚 Models

### User
- Roles: CLIENT, DOCTOR, THERAPIST, MANAGER
- Fields: name, email, phone, age, gender, health conditions, allergies
- Doctor/Therapist: specialization, license, experience, bio
- Client: assigned doctor/therapist

### Therapy
- Name, description, duration, price
- Benefits and applicable doshas
- Active status

### Appointment
- Client, therapy, doctor, therapist
- Date, time, duration
- Status: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
- Notes from doctor and therapist

### DoshaStatus
- Vata, Pitta, Kapha percentages
- Dominant dosha
- Recorded by doctor
- Timestamp and notes

## 🔌 API Routes

### Auth
- `GET /auth/login` - Login page
- `POST /auth/login` - Login action
- `GET /auth/register` - Register page
- `POST /auth/register` - Register action
- `GET /auth/logout` - Logout

### Client
- `GET /client/dashboard`
- `GET /client/appointments`
- `GET /client/book-therapy`
- `POST /client/book-therapy`
- `GET /client/dosha-tracker`
- `GET /client/profile`
- `POST /client/profile`

### Doctor
- `GET /doctor/dashboard`
- `GET /doctor/appointments`
- `POST /doctor/appointments/:appointmentId/confirm`
- `POST /doctor/appointments/:appointmentId/complete`
- `GET /doctor/patients`
- `GET /doctor/patient/:patientId`
- `GET /doctor/patient/:patientId/dosha`
- `POST /doctor/patient/:patientId/dosha`

### Therapist
- `GET /therapist/dashboard`
- `GET /therapist/today-sessions`
- `GET /therapist/session/:sessionId`
- `POST /therapist/session/:sessionId/complete`
- `GET /therapist/upcoming-appointments`

### Manager
- `GET /manager/dashboard`
- `GET/POST/PUT/DELETE /manager/users`
- `GET/POST/PUT/DELETE /manager/therapies`
- `GET /manager/appointments`
- `GET /manager/reports`

## 🛠️ Technologies

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, vanilla JavaScript
- **Styling**: Pure CSS (responsive)
- **Authentication**: express-session, bcryptjs
- **Utilities**: dotenv, nodemon (dev)

## 📝 Environment Variables

```
MONGO_URI        # MongoDB connection string
SESSION_SECRET   # Secret key for session encryption
PORT             # Server port (default: 3000)
NODE_ENV         # development or production
```

## 🧪 Testing

Demo credentials (create these in the database first):
- **Client**: client@example.com / password
- **Doctor**: doctor@example.com / password
- **Therapist**: therapist@example.com / password
- **Manager**: manager@example.com / password

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "express-session": "^1.17.3",
  "ejs": "^3.1.9",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "connect-mongo": "^5.0.2"
}
```

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Seeding** (Optional - create seed.js)
   ```bash
   node seed.js
   ```

3. **Build for Production**
   - Set NODE_ENV=production
   - Ensure MongoDB Atlas connection is configured
   - Deploy to your hosting platform

## 🐛 Troubleshooting

### Connection Issues
- Verify MongoDB URI in .env
- Check if MongoDB is running locally
- Ensure network access for MongoDB Atlas

### Authentication Issues
- Clear session/cookies
- Verify SESSION_SECRET is set
- Check user role in database

### Styling Issues
- Clear browser cache
- Check CSS file path in layout
- Verify public folder permissions

## 📚 Next Steps

1. **Data Seeding**: Create demo data for testing
2. **Email Notifications**: Add appointment reminders
3. **Payment Integration**: Stripe or similar
4. **Reporting Dashboard**: Advanced analytics
5. **Mobile App**: React Native version
6. **Video Consultations**: Integrate Zoom or similar

## 📄 License

ISC

## 👨‍💻 Author

Panchkarma Clinic Development Team

---

**Happy Coding! 🌿**
