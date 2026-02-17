import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDatabase } from '../utils/database';

const checkAdmin = async () => {
  try {
    await connectDatabase();
    
    const admin = await Admin.findOne({ email: 'admin@watchstore.com' });
    
    if (!admin) {
      console.log('❌ No admin found with email: admin@watchstore.com');
    } else {
      console.log('✅ Admin found:');
      console.log('Email:', admin.email);
      console.log('First Name:', admin.firstName);
      console.log('Last Name:', admin.lastName);
      console.log('Role:', admin.role);
      console.log('Is Active:', admin.isActive);
      console.log('Created At:', admin.createdAt);
      
      // Test password
      const testPasswords = ['admin123', 'admin123456'];
      for (const pwd of testPasswords) {
        const isValid = await admin.comparePassword(pwd);
        console.log(`Password "${pwd}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAdmin();
