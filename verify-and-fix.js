const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Backend Setup...\n');
console.log('═══════════════════════════════════════════════════════\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
const distExists = fs.existsSync(distPath);

console.log(`1. Dist Folder: ${distExists ? '✅ EXISTS' : '❌ MISSING'}`);

let routesExist = false;
let controllersExist = false;

if (!distExists) {
  console.log('   → Run: npm run build\n');
} else {
  // Check if routes are compiled
  const routesPath = path.join(distPath, 'routes');
  routesExist = fs.existsSync(routesPath);
  console.log(`2. Routes Compiled: ${routesExist ? '✅ YES' : '❌ NO'}`);
  
  if (routesExist) {
    const adminRoutesPath = path.join(routesPath, 'admin.js');
    const adminRoutesExist = fs.existsSync(adminRoutesPath);
    console.log(`3. Admin Routes: ${adminRoutesExist ? '✅ YES' : '❌ NO'}`);
    
    const indexRoutesPath = path.join(routesPath, 'index.js');
    const indexRoutesExist = fs.existsSync(indexRoutesPath);
    console.log(`4. Index Routes: ${indexRoutesExist ? '✅ YES' : '❌ NO'}`);
  }
  
  // Check controllers
  const controllersPath = path.join(distPath, 'controllers');
  controllersExist = fs.existsSync(controllersPath);
  console.log(`5. Controllers Compiled: ${controllersExist ? '✅ YES' : '❌ NO'}`);

  if (controllersExist) {
    const productControllerPath = path.join(controllersPath, 'productController.js');
    const productControllerExist = fs.existsSync(productControllerPath);
    console.log(`6. Product Controller: ${productControllerExist ? '✅ YES' : '❌ NO'}`);
  }

  // Check middleware
  const middlewarePath = path.join(distPath, 'middleware');
  const middlewareExist = fs.existsSync(middlewarePath);
  console.log(`7. Middleware Compiled: ${middlewareExist ? '✅ YES' : '❌ NO'}`);

  if (middlewareExist) {
    const uploadPath = path.join(middlewarePath, 'upload.js');
    const uploadExist = fs.existsSync(uploadPath);
    console.log(`8. Upload Middleware: ${uploadExist ? '✅ YES' : '❌ NO'}`);
  }

  // Check utils
  const utilsPath = path.join(distPath, 'utils');
  const utilsExist = fs.existsSync(utilsPath);
  console.log(`9. Utils Compiled: ${utilsExist ? '✅ YES' : '❌ NO'}`);

  if (utilsExist) {
    const supabasePath = path.join(utilsPath, 'supabase.js');
    const supabaseExist = fs.existsSync(supabasePath);
    console.log(`10. Supabase Utils: ${supabaseExist ? '✅ YES' : '❌ NO'}`);
  }
}

console.log('\n═══════════════════════════════════════════════════════\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);
console.log(`Environment File: ${envExists ? '✅ EXISTS' : '❌ MISSING'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasPort = envContent.includes('PORT=');
  const hasMongoDB = envContent.includes('MONGODB_URI=');
  const hasJWT = envContent.includes('JWT_SECRET=');
  const hasFrontendURL = envContent.includes('FRONTEND_URL=');
  
  console.log(`  - PORT: ${hasPort ? '✅' : '❌'}`);
  console.log(`  - MONGODB_URI: ${hasMongoDB ? '✅' : '❌'}`);
  console.log(`  - JWT_SECRET: ${hasJWT ? '✅' : '❌'}`);
  console.log(`  - FRONTEND_URL: ${hasFrontendURL ? '✅' : '❌'}`);
}

console.log('\n═══════════════════════════════════════════════════════\n');

// Recommendations
console.log('📝 RECOMMENDATIONS:\n');

if (!distExists || !controllersExist || !routesExist) {
  console.log('❌ Backend not compiled properly!');
  console.log('   Run these commands:');
  console.log('   1. npm install');
  console.log('   2. npm run build');
  console.log('   3. npm run dev\n');
} else {
  console.log('✅ Backend is compiled!');
  console.log('   To start server:');
  console.log('   → npm run dev\n');
}

console.log('📋 Expected Routes:');
console.log('   POST   /api/admin/login');
console.log('   GET    /api/admin/products');
console.log('   POST   /api/admin/products');
console.log('   PUT    /api/admin/products/:id');
console.log('   DELETE /api/admin/products/:id\n');

console.log('🧪 Test After Starting:');
console.log('   curl http://localhost:5000/api/health\n');

console.log('═══════════════════════════════════════════════════════\n');
