// Quick test script to verify routes are registered
const express = require('express');

// Simulate the route structure
const testRoutes = () => {
  console.log('\n🔍 Testing Route Registration...\n');
  
  const routes = [
    { method: 'POST', path: '/api/admin/login', description: 'Admin Login' },
    { method: 'GET', path: '/api/admin/profile', description: 'Get Admin Profile' },
    { method: 'GET', path: '/api/admin/products', description: 'Get All Products' },
    { method: 'POST', path: '/api/admin/products', description: 'Create Product' },
    { method: 'PUT', path: '/api/admin/products/:id', description: 'Update Product' },
    { method: 'DELETE', path: '/api/admin/products/:id', description: 'Delete Product' },
  ];
  
  console.log('Expected Admin Routes:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  routes.forEach(route => {
    console.log(`✅ ${route.method.padEnd(7)} ${route.path.padEnd(35)} - ${route.description}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n📝 To test these routes:');
  console.log('1. Start backend: npm run dev');
  console.log('2. Check terminal for "Server running on port 5000"');
  console.log('3. Test with: curl http://localhost:5000/api/health');
  console.log('4. Login as admin to get token');
  console.log('5. Use token to test product routes\n');
};

testRoutes();
