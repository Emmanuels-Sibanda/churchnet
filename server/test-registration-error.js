// Test script to see the actual registration error
require('dotenv').config();
const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('\n=== Testing Registration Endpoint ===\n');
    
    const testData = {
      name: 'Test Church',
      email: `test${Date.now()}@example.com`,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#',
      phone: '1234567890',
      city: 'Pretoria',
      province: 'Gauteng',
      address: '123 Test St',
      zip_code: '0001',
      description: 'Test church',
      privacy_accepted: true
    };

    console.log('Sending registration request...');
    console.log('Email:', testData.email);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('\n❌ Error occurred:');
    
    if (error.response) {
      // Server responded with error
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
      console.log('Error message:', error.response.data?.error || error.response.data?.message);
      console.log('Error details:', error.response.data?.details);
    } else if (error.request) {
      // Request made but no response
      console.log('No response from server');
      console.log('Is the server running on port 5000?');
    } else {
      // Error setting up request
      console.log('Error:', error.message);
    }
    
    if (error.stack) {
      console.log('\nStack trace:');
      console.log(error.stack);
    }
  }
};

testRegistration();


