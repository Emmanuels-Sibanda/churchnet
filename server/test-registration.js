/**
 * Test Registration Endpoint
 * Run: node test-registration.js
 */

const axios = require('axios');

async function testRegistration() {
  const testData = {
    name: 'Test Church',
    email: `test${Date.now()}@example.com`,
    password: 'Test123!@#',
    phone: '1234567890',
    city: 'Pretoria',
    province: 'Gauteng'
  };

  console.log('🧪 Testing Registration...\n');
  console.log('Test Data:', { ...testData, password: '***' });
  console.log('');

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data);
    console.error('Full error:', error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
  }
}

testRegistration();


