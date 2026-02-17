import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDatabase } from '../utils/database';

const resetAdminPassword = async () => {
  try {
    await connectDatabase();
    
    const admin = await Admin.findOne({ email: 'admin@watchstore.com' });
    if (!admin) {
      console.log('❌ Admin not found. Creating new admin...');
      
      const newAdmin = new Admin({
        email: 'admin@watchstore.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super-admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin created successfully!');
    } else {
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Admin password reset successfully!');
    }
    
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@watchstore.com');
    console.log('Password: admin123');
    console.log('Role:', admin?.role || 'super-admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
