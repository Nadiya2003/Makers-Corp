require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for user seeding');
    
    await User.deleteMany({ email: 'admin@ceylon.lk' });
    
    const user = await User.create({
      name: 'Admin',
      email: 'admin@ceylon.lk',
      password: 'adminpassword123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully');
    console.log('Email: admin@ceylon.lk');
    console.log('Password: adminpassword123');
    
    process.exit();
  } catch (error) {
    console.error('User seeding failed:', error);
    process.exit(1);
  }
};

seedUser();
