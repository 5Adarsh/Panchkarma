# Panchkarma Clinic - Quick Setup Guide

## 📋 Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB set up (Atlas or local)
- [ ] npm or yarn available
- [ ] Code editor (VSCode recommended)

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- ejs (templating engine)
- express-session (session management)
- bcryptjs (password hashing)
- dotenv (environment variables)
- nodemon (dev only - auto-restart)

### 2. Configure Environment
Create `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/panchkarma?retryWrites=true&w=majority

# Session Security
SESSION_SECRET=choose_a_very_secure_random_string

# Server
PORT=3000
NODE_ENV=development
```

**Get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Replace with your credentials

### 3. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 4. Access Application
1. Go to `http://localhost:3000/auth/login`
2. Use demo credentials (see login page for options)
3. Create new account by registering

## 📊 Create Demo User

### Via Node REPL (Quick)
```javascript
// Run: node
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

User.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '5551234567',
  password: 'password123',
  role: 'CLIENT'
}).then(() => {
  console.log('User created');
  process.exit(0);
});
```

### Via Database UI (MongoDB Compass)
1. Download MongoDB Compass
2. Connect to your MongoDB instance
3. Create database: `panchkarma`
4. Create collection: `users`
5. Insert document with proper structure

## 🧭 Project Navigation

### Key Directories
- `/routes` - URL routing logic
- `/controllers` - Business logic
- `/models` - Database schemas
- `/views` - EJS HTML templates
- `/public` - CSS, JavaScript, images
- `/middleware` - Authentication, authorization
- `/utils` - Helper functions

### Common File Locations
- Login page: `views/auth/login.ejs`
- Client dashboard: `views/client/dashboard.ejs`
- Styles: `public/css/main.css`
- Client JS: `public/js/common.js`

## 🔑 Important Routes

### Authentication
- `GET /auth/login` - Login form
- `GET /auth/register` - Registration form
- `GET /auth/logout` - Logout

### Client Pages (require login)
- `/client/dashboard` - Main dashboard
- `/client/appointments` - Manage appointments
- `/client/book-therapy` - Book new therapy
- `/client/profile` - Edit profile
- `/client/dosha-tracker` - View dosha history

### Doctor Pages
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - Manage appointments
- `/doctor/patients` - View patients

### Manager Pages
- `/manager/dashboard` - Analytics & stats
- `/manager/users` - Manage users
- `/manager/therapies` - Manage therapies
- `/manager/reports` - View reports

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check MongoDB URI in `.env`
- Ensure MongoDB is running (if local)
- Verify IP whitelist for Atlas (if cloud)

### Cannot find module 'express'
```bash
npm install  # Re-install dependencies
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

### Session not persisting
- Clear browser cookies
- Check SESSION_SECRET is set
- Verify express-session config in server.js

## 📚 Development Tips

### Debug Mode
Add this to see detailed logs:
```javascript
// In server.js
const morgan = require('morgan');
app.use(morgan('dev'));  // Install: npm install morgan
```

### Database Inspection
```bash
# Install MongoDB Compass GUI for visual browsing
# Or use Mongoose connection in Node REPL
```

### Hot Reload
Already configured! Just save files and server auto-restarts.

## 🎨 Customize UI

### Change Colors
Edit `/public/css/main.css` (top of file):
```css
:root {
  --primary: #667eea;      /* Change these colors */
  --secondary: #764ba2;
  --success: #51cf66;
  ...
}
```

### Update Navbar
Edit role-specific navbar files:
- `views/partials/navbar_client.ejs`
- `views/partials/navbar_doctor.ejs`
- etc.

## 🚀 Ready to Code?

1. **Next: Add a new page**
   - Create view file in `/views/client/`
   - Add controller function
   - Add route
   - Test!

2. **Add new model**
   - Create schema in `/models/`
   - Use in controllers
   - Connect to routes

3. **Style changes**
   - Edit `/public/css/main.css`
   - Reload browser (auto-reload on save)

## 📞 Help Resources

- Express Docs: https://expressjs.com
- MongoDB Mongoose: https://mongoosejs.com
- EJS Templating: https://ejs.co
- Node.js Docs: https://nodejs.org/docs

## ✅ Quick Checklist

- [ ] `.env` file created with MONGO_URI
- [ ] MongoDB connection working
- [ ] `npm install` completed
- [ ] `npm run dev` running without errors
- [ ] Can access `http://localhost:3000`
- [ ] Can login with test account
- [ ] Dashboard loads correctly

**You're all set! Happy coding! 🌿**
