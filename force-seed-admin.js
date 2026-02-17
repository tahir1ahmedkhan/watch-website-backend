const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const forceSeedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully!');

    // Define Admin schema
    const adminSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' },
      isActive: { type: Boolean, default: true },
      lastLogin: Date
    }, { timestamps: true });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@watchstore.com' });
    
    if (existingAdmin) {
      console.log('\n✅ Super admin already exists in database!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', `${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log('Role:', existingAdmin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('\n🔄 Creating super admin...');
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123456', salt);

      // Create admin
      const admin = await Admin.create({
        email: 'admin@watchstore.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super-admin',
        isActive: true
      });

      console.log('✅ Super admin created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', admin.email);
      console.log('Name:', `${admin.firstName} ${admin.lastName}`);
      console.log('Role:', admin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n🔑 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@watchstore.com');
    console.log('Password: admin123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

forceSeedAdmin();
