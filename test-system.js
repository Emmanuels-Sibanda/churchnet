/**
 * System Test Script
 * Tests critical fixes and system functionality
 */

const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testChurchId = null;
let testVenueId = null;
let testBookingId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n🧪 Testing: ${name}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testServerHealth() {
  logTest('Server Health Check');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.status === 'OK') {
      logSuccess('Server is running');
      return true;
    }
  } catch (error) {
    logError(`Server not responding: ${error.message}`);
    logWarning('Make sure the server is running on port 5000');
    return false;
  }
}

async function testRegistration() {
  logTest('User Registration');
  // Wait a bit to avoid rate limiting from previous tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    const email = `test-${Date.now()}@test.com`;
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Church',
      email: email,
      password: 'test123456',
      city: 'Test City',
      state: 'Test State'
    });
    
    if (response.data.token) {
      authToken = response.data.token;
      testChurchId = response.data.church.id;
      logSuccess('Registration successful');
      log(`Token: ${authToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    logError(`Registration failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testLogin() {
  logTest('User Login');
  // Wait a bit to avoid rate limiting from previous tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@church.com',
      password: 'admin123'
    });
    
    if (response.data.token) {
      authToken = response.data.token;
      logSuccess('Login successful');
      return true;
    }
  } catch (error) {
    logError(`Login failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testRateLimiting() {
  logTest('Rate Limiting (Auth Endpoints)');
  logWarning('Attempting 6 rapid login requests (limit is 5)...');
  
  const requests = [];
  for (let i = 0; i < 6; i++) {
    requests.push(
      axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'wrong'
      }).catch(err => err.response)
    );
  }
  
  try {
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r?.status === 429);
    
    if (rateLimited) {
      logSuccess('Rate limiting is working - 6th request was rate limited');
      return true;
    } else {
      logWarning('Rate limiting may not be working - all requests succeeded');
      return false;
    }
  } catch (error) {
    logError(`Rate limit test error: ${error.message}`);
    return false;
  }
}

async function testCreateVenue() {
  logTest('Create Venue');
  try {
    const response = await axios.post(
      `${BASE_URL}/venues`,
      {
        name: 'Test Venue',
        description: 'Test venue for testing',
        capacity: 100,
        price_per_hour: 50.00,
        city: 'Test City',
        state: 'Test State'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.id) {
      testVenueId = response.data.id;
      logSuccess(`Venue created with ID: ${testVenueId}`);
      return true;
    }
  } catch (error) {
    logError(`Create venue failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testDateValidation() {
  logTest('Date Validation');
  
  if (!testVenueId) {
    logWarning('No venue ID available, skipping date validation test');
    return false;
  }
  
  try {
    // Test 1: End date before start date
    log('Testing: end_date before start_date...');
    try {
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          booking_type: 'venue',
          venue_id: testVenueId,
          start_date: new Date('2025-12-31').toISOString(),
          end_date: new Date('2025-12-01').toISOString()
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      logError('Date validation failed - accepted invalid dates');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('End date must be after')) {
        logSuccess('Rejected booking with end_date before start_date');
      } else {
        logError(`Unexpected error: ${error.response?.data?.error || error.message}`);
        return false;
      }
    }
    
    // Test 2: Past dates
    log('Testing: past dates...');
    try {
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          booking_type: 'venue',
          venue_id: testVenueId,
          start_date: new Date('2020-01-01').toISOString(),
          end_date: new Date('2020-01-02').toISOString()
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      logError('Date validation failed - accepted past dates');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('future')) {
        logSuccess('Rejected booking with past dates');
        return true;
      } else {
        logError(`Unexpected error: ${error.response?.data?.error || error.message}`);
        return false;
      }
    }
  } catch (error) {
    logError(`Date validation test error: ${error.message}`);
    return false;
  }
}

async function testBookingConflict() {
  logTest('Booking Conflict Detection');
  
  if (!testVenueId) {
    logWarning('No venue ID available, skipping conflict test');
    return false;
  }
  
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const startDate = futureDate.toISOString();
    
    futureDate.setHours(futureDate.getHours() + 2);
    const endDate = futureDate.toISOString();
    
    // Create first booking
    log('Creating first booking...');
    const booking1 = await axios.post(
      `${BASE_URL}/bookings`,
      {
        booking_type: 'venue',
        venue_id: testVenueId,
        start_date: startDate,
        end_date: endDate
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (booking1.data.id) {
      testBookingId = booking1.data.id;
      logSuccess('First booking created');
    }
    
    // Try to create overlapping booking
    log('Attempting overlapping booking...');
    try {
      const overlapStart = new Date(startDate);
      overlapStart.setHours(overlapStart.getHours() + 1);
      const overlapEnd = new Date(endDate);
      overlapEnd.setHours(overlapEnd.getHours() + 1);
      
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          booking_type: 'venue',
          venue_id: testVenueId,
          start_date: overlapStart.toISOString(),
          end_date: overlapEnd.toISOString()
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      logError('Conflict detection failed - overlapping booking was accepted');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('booked')) {
        logSuccess('Conflict detection working - overlapping booking rejected');
        return true;
      } else {
        logError(`Unexpected error: ${error.response?.data?.error || error.message}`);
        return false;
      }
    }
  } catch (error) {
    logError(`Conflict test error: ${error.message}`);
    return false;
  }
}

async function testAvailabilityCheck() {
  logTest('Availability Checking');
  
  if (!testVenueId) {
    logWarning('No venue ID available, skipping availability test');
    return false;
  }
  
  try {
    // Get venue details first
    log('Fetching venue details...');
    const venueResponse = await axios.get(`${BASE_URL}/venues/${testVenueId}`);
    const venue = venueResponse.data;
    
    // Mark venue as unavailable
    log('Marking venue as unavailable...');
    await axios.put(
      `${BASE_URL}/venues/${testVenueId}`,
      {
        name: venue.name,
        description: venue.description || null,
        capacity: venue.capacity || null,
        price_per_hour: venue.price_per_hour,
        price_per_day: venue.price_per_day || null,
        address: venue.address || null,
        city: venue.city || null,
        state: venue.state || null,
        zip_code: venue.zip_code || null,
        is_available: false
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    // Try to book unavailable venue
    log('Attempting to book unavailable venue...');
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      const startDate = futureDate.toISOString();
      futureDate.setHours(futureDate.getHours() + 2);
      const endDate = futureDate.toISOString();
      
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          booking_type: 'venue',
          venue_id: testVenueId,
          start_date: startDate,
          end_date: endDate
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      logError('Availability check failed - booked unavailable venue');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('not available')) {
        logSuccess('Availability check working - unavailable venue rejected');
        
        // Mark it back as available
        await axios.put(
          `${BASE_URL}/venues/${testVenueId}`,
          {
            name: venue.name,
            description: venue.description || null,
            capacity: venue.capacity || null,
            price_per_hour: venue.price_per_hour,
            price_per_day: venue.price_per_day || null,
            address: venue.address || null,
            city: venue.city || null,
            state: venue.state || null,
            zip_code: venue.zip_code || null,
            is_available: true
          },
          {
            headers: { Authorization: `Bearer ${authToken}` }
          }
        );
        return true;
      } else {
        logError(`Unexpected error: ${error.response?.data?.error || error.message}`);
        return false;
      }
    }
  } catch (error) {
    logError(`Availability test error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  log('\n═══════════════════════════════════════', 'blue');
  log('   SYSTEM TEST SUITE', 'blue');
  log('═══════════════════════════════════════\n', 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  // Test 1: Server Health
  results.total++;
  if (await testServerHealth()) {
    results.passed++;
  } else {
    results.failed++;
    logError('Cannot continue tests - server is not running');
    log('\nTo start the server:');
    log('1. Create server/.env file with JWT_SECRET');
    log('2. Run: npm run dev (from root) or npm run server (from server/)');
    return;
  }
  
  // Test 2: Login (use admin account first)
  results.total++;
  if (await testLogin()) {
    results.passed++;
  } else {
    results.failed++;
    logError('Cannot continue tests - login failed');
    log('Make sure admin account exists (admin@church.com / admin123)');
    return;
  }
  
  // Test 3: Registration (test after login to avoid rate limit)
  results.total++;
  if (await testRegistration()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 4: Create Venue
  results.total++;
  if (await testCreateVenue()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 5: Date Validation
  results.total++;
  if (await testDateValidation()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 6: Booking Conflict
  results.total++;
  if (await testBookingConflict()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 7: Availability Check
  
  // Test 8: Rate Limiting (test last to avoid blocking other tests)
  results.total++;
  logWarning('Waiting 20 seconds before rate limit test to reset counter...');
  await new Promise(resolve => setTimeout(resolve, 20000));
  if (await testRateLimiting()) {
    results.passed++;
  } else {
    results.failed++;
  }
  results.total++;
  if (await testAvailabilityCheck()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Summary
  log('\n═══════════════════════════════════════', 'blue');
  log('   TEST RESULTS SUMMARY', 'blue');
  log('═══════════════════════════════════════\n', 'blue');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`, 'blue');
  
  if (results.failed === 0) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed. Review the output above.', 'yellow');
  }
}

// Run tests
runTests().catch(error => {
  logError(`Test suite error: ${error.message}`);
  process.exit(1);
});

