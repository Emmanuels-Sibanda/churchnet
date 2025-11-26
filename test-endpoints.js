const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('Testing API endpoints...\n');

  // Test provinces endpoint
  try {
    const provincesRes = await axios.get(`${BASE_URL}/provinces`);
    console.log('✓ Provinces endpoint working');
    console.log('  Provinces:', provincesRes.data);
  } catch (error) {
    console.log('✗ Provinces endpoint failed:', error.response?.status, error.response?.data || error.message);
  }

  // Test venues endpoint
  try {
    const venuesRes = await axios.get(`${BASE_URL}/venues`);
    console.log('\n✓ Venues endpoint working');
    console.log('  Venues count:', venuesRes.data?.length || 0);
    if (venuesRes.data?.length > 0) {
      console.log('  Sample venue:', venuesRes.data[0].name);
    }
  } catch (error) {
    console.log('\n✗ Venues endpoint failed:', error.response?.status);
    console.log('  Error:', error.response?.data || error.message);
  }

  // Test equipment endpoint
  try {
    const equipmentRes = await axios.get(`${BASE_URL}/equipment`);
    console.log('\n✓ Equipment endpoint working');
    console.log('  Equipment count:', equipmentRes.data?.length || 0);
  } catch (error) {
    console.log('\n✗ Equipment endpoint failed:', error.response?.status);
    console.log('  Error:', error.response?.data || error.message);
  }
}

testEndpoints().catch(console.error);

