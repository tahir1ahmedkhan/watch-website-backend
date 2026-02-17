import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDatabase } from '../utils/database';

const listAdmins = async () => {
  try {
    await connectDatabase();
    
    const admins = await Admin.find({});
    
    console.log(`Found ${admins.length} admin(s):\n`);
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: "${admin.email}"`);
      console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   ID: ${admin._id}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

listAdmins();
