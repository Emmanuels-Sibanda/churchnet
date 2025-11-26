const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('=== Testing API Endpoints ===\n');

  try {
    // Test venues endpoint
    console.log('Testing /api/venues...');
    const venuesResponse = await axios.get(`${API_BASE}/venues`);
    console.log(`✓ Venues endpoint: ${venuesResponse.data.length} venues returned`);
    if (venuesResponse.data.length > 0) {
      console.log(`  Sample: ${venuesResponse.data[0].name}`);
    }

    // Test equipment endpoint
    console.log('\nTesting /api/equipment...');
    const equipmentResponse = await axios.get(`${API_BASE}/equipment`);
    console.log(`✓ Equipment endpoint: ${equipmentResponse.data.length} items returned`);
    if (equipmentResponse.data.length > 0) {
      console.log(`  Sample: ${equipmentResponse.data[0].name}`);
    }

    console.log('\n=== All Tests Passed ===');
    console.log(`Total venues available: ${venuesResponse.data.length}`);
    console.log(`Total equipment available: ${equipmentResponse.data.length}`);
  } catch (error) {
    console.error('❌ Error testing endpoints:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    } else if (error.request) {
      console.error('  No response received. Is the server running?');
      console.error('  Start server with: cd server && npm start');
    } else {
      console.error('  Error:', error.message);
    }
  }
}

testEndpoints();

