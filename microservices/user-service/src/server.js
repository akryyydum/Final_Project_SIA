require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const User = require('./models/User'); // <-- add this

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // --- Add default admin if not exists ---
  const adminEmail = 'Admin@admin.com';
  const adminPassword = 'Admin';
  const adminName = 'Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Default admin user created:', adminEmail);
  } else {
    console.log('Default admin user already exists.');
  }
  // ---------------------------------------

  app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
}).catch((err) => console.error('MongoDB connection error:', err));