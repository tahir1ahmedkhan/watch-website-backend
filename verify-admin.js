const mongoose = require('mongoose');
require('dotenv').config();

const verifyAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const Admin = mongoose.model('Admin', new mongoose.Schema({
      email: String,
      firstName: String,
      lastName: String,
      role: String,
      isActive: Boolean,
      createdAt: Date
    }));

    const admin = await Admin.findOne({ email: 'admin@watchstore.com' });
    
    if (admin) {
      console.log('\n✅ Super Admin Found:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', admin.email);
      console.log('Name:', `${admin.firstName} ${admin.lastName}`);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
      console.log('Created:', admin.createdAt);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔑 Login Credentials:');
      console.log('Email: admin@watchstore.com');
      console.log('Password: admin123456');
    } else {
      console.log('❌ Admin not found');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyAdmin();
