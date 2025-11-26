/**
 * Direct Registration Test
 * Tests the registration route directly
 */

require('dotenv').config();
const express = require('express');
const request = require('supertest');
const app = express();
app.use(express.json());

// Import the auth router
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

async function testRegistration() {
  const testData = {
    name: 'Test Church Direct',
    email: `testdirect${Date.now()}@example.com`,
    password: 'Test123!@#',
    phone: '1234567890',
    city: 'Pretoria',
    province: 'Gauteng'
  };

  console.log('🧪 Testing Registration Directly...\n');
  console.log('Test Data:', { ...testData, password: '***' });
  console.log('');

  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testData)
      .expect('Content-Type', /json/);

    console.log('✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.body, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('❌ Registration failed!');
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('❌ Request failed:', error.message);
    }
  }
}

// Need to initialize database first
const db = require('./database/db');
db.init().then(() => {
  testRegistration().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Database init error:', err);
  process.exit(1);
});


