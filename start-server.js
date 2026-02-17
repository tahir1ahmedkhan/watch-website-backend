#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 Starting Watch Store Backend Server...\n');
console.log('═══════════════════════════════════════════════════════\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ Dist folder not found!');
  console.log('   Building project first...\n');
  
  const build = spawn('npm', ['run', 'build'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  
  build.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Build successful!');
      console.log('   Starting server...\n');
      startServer();
    } else {
      console.log('\n❌ Build failed!');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dist folder found');
  console.log('   Starting server...\n');
  startServer();
}

function startServer() {
  const server = spawn('node', ['dist/server.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n❌ Server exited with code ${code}`);
    }
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}
