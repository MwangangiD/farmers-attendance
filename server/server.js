const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ── SEED USERS ──
const seedUsers = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  // Create admin
  const adminExists = await User.findOne({ email: 'admin@farmerschoice.com' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Dickson Mwangangi',
      email: 'admin@farmerschoice.com',
      password: hashed,
      role: 'admin'
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Create guard
  const guardExists = await User.findOne({ email: 'guard@farmerschoice.com' });
  if (!guardExists) {
    const hashed = await bcrypt.hash('guard123', 10);
    await User.create({
      name: 'Gate Guard',
      email: 'guard@farmerschoice.com',
      password: hashed,
      role: 'guard'
    });
    console.log('Guard user created');
  } else {
    console.log('Guard user already exists');
  }

  // Create payroll user
  const payrollExists = await User.findOne({ email: 'payroll@farmerschoice.com' });
  if (!payrollExists) {
    const hashed = await bcrypt.hash('payroll123', 10);
    await User.create({
      name: 'Payroll Staff',
      email: 'payroll@farmerschoice.com',
      password: hashed,
      role: 'payroll'
    });
    console.log('Payroll user created');
  } else {
    console.log('Payroll user already exists');
  }
};

seedUsers();

// ── ROUTES ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/workers',    require('./routes/workers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/reports',    require('./routes/reports'));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ message: 'Farmers Choice Attendance API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));