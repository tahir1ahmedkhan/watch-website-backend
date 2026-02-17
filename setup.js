 const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Watch Store Backend...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('\n📝 Creating .env file...');
  try {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created from .env.example');
    console.log('⚠️  Please update the .env file with your configuration');
  } catch (error) {
    console.error('❌ Failed to create .env file');
  }
} else {
  console.log('✅ .env file already exists');
}

// Build TypeScript
console.log('\n🔨 Building TypeScript...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ TypeScript build completed');
} catch (error) {
  console.error('❌ TypeScript build failed');
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update .env file with your configuration');
console.log('3. Run "npm run seed" to populate the database (optional)');
console.log('4. Run "npm run dev" to start the development server');
console.log('\n🔗 The server will be available at: http://localhost:5000');
console.log('📚 API documentation: http://localhost:5000/api/health');