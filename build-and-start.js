const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building TypeScript project...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('🗑️  Cleaned dist directory');
  }

  // Build TypeScript
  execSync('npx tsc', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ TypeScript build completed successfully');

  // Check if server.js exists
  const serverPath = path.join(__dirname, 'dist', 'server.js');
  if (fs.existsSync(serverPath)) {
    console.log('✅ server.js found in dist directory');
    console.log('🚀 Ready to start with: npm start');
  } else {
    console.error('❌ server.js not found in dist directory');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}