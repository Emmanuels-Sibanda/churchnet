// Live test to see what error is happening
require('dotenv').config();
const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('\n=== Testing Registration Endpoint ===\n');
    
    const testData = {
      name: 'Test Church Live',
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
    console.log('URL: http://localhost:5000/api/auth/register');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n❌ ERROR OCCURRED:');
    console.log('Error type:', error.constructor.name);
    
    if (error.response) {
      // Server responded with error
      console.log('\n--- Server Response ---');
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('\nResponse Data:');
      console.log(JSON.stringify(error.response.data, null, 2));
      console.log('\nResponse Headers:');
      console.log(JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // Request made but no response
      console.log('\n--- No Response from Server ---');
      console.log('Request was made but server did not respond');
      console.log('Is the server running on port 5000?');
      console.log('Error code:', error.code);
    } else {
      // Error setting up request
      console.log('\n--- Request Setup Error ---');
      console.log('Error message:', error.message);
    }
    
    if (error.stack) {
      console.log('\n--- Stack Trace ---');
      console.log(error.stack);
    }
  }
};

// Check if server is running first
axios.get('http://localhost:5000/api/venues')
  .then(() => {
    console.log('✅ Server is running');
    testRegistration();
  })
  .catch(() => {
    console.log('❌ Server is NOT running on port 5000');
    console.log('Please start your server first:');
    console.log('  cd server');
    console.log('  npm start');
  });


