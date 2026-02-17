const fetch = require('node-fetch');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@watchstore.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', data.data.token);
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdminLogin();
