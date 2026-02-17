import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDatabase } from '../utils/database';

const seedAdmin = async () => {
  try {
    await connectDatabase();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@watchstore.com' });
    if (existingAdmin) {
      console.log('✅ Super admin already exists!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email: admin@watchstore.com');
      console.log('Password: admin123456');
      console.log('Role:', existingAdmin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(0);
    }

    // Create super admin
    const admin = new Admin({
      email: 'admin@watchstore.com',
      password: 'admin123456',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super-admin'
    });

    await admin.save();
    console.log('✅ Super admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@watchstore.com');
    console.log('Password: admin123456');
    console.log('Role: super-admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();