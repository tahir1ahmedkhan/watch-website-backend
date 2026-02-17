import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDatabase } from '../utils/database';

const debugAdmin = async () => {
  try {
    await connectDatabase();
    
    console.log('Searching for admin...\n');
    
    // Try different queries
    const admin1 = await Admin.findOne({ email: 'admin@watchstore.com' });
    console.log('Query 1 - exact match:', admin1 ? 'Found' : 'Not found');
    
    const admin2 = await Admin.findOne({ email: 'admin@watchstore.com', isActive: true });
    console.log('Query 2 - with isActive:', admin2 ? 'Found' : 'Not found');
    
    const allAdmins = await Admin.find({});
    console.log('\nAll admins in database:', allAdmins.length);
    
    allAdmins.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log('  _id:', admin._id);
      console.log('  email:', JSON.stringify(admin.email));
      console.log('  email (raw):', admin.email);
      console.log('  email length:', admin.email.length);
      console.log('  isActive:', admin.isActive);
      console.log('  role:', admin.role);
      
      // Test password
      admin.comparePassword('admin123').then(isValid => {
        console.log('  Password "admin123" valid:', isValid);
      });
    });
    
    setTimeout(() => process.exit(0), 2000);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugAdmin();
