require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB for Super Admin seeding');
    
    // Check if admin@makers-corp.com exists
    let admin = await User.findOne({ email: 'admin@makers-corp.com' });
    if (admin) {
      admin.name = 'Super Admin';
      admin.password = 'MakersCorp@2026!';
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Updated existing admin@makers-corp.com credentials');
    } else {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@makers-corp.com',
        password: 'MakersCorp@2026!',
        role: 'admin'
      });
      console.log('✅ Created new Super Admin user: admin@makers-corp.com');
    }
    
    console.log('Email: admin@makers-corp.com');
    console.log('Password: MakersCorp@2026!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Super Admin seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
