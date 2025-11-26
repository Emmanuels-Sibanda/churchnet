// Script to verify JWT_SECRET is set correctly
require('dotenv').config();

console.log('\n=== JWT_SECRET Verification ===\n');

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.log('❌ JWT_SECRET is NOT set!');
  console.log('\nTo fix:');
  console.log('1. Open server/.env file');
  console.log('2. Add this line:');
  console.log('   JWT_SECRET=your-secret-key-here');
  console.log('3. Or run: node add-jwt-secret.ps1');
  process.exit(1);
}

if (jwtSecret.length < 32) {
  console.log('⚠️  WARNING: JWT_SECRET is too short (should be at least 32 characters)');
  console.log(`   Current length: ${jwtSecret.length}`);
}

if (jwtSecret.includes('\n') || jwtSecret.includes('\r')) {
  console.log('⚠️  WARNING: JWT_SECRET appears to have line breaks!');
  console.log('   This will cause issues. Make sure it\'s on a single line.');
}

console.log('✅ JWT_SECRET is set');
console.log(`   Length: ${jwtSecret.length} characters`);
console.log(`   First 20 chars: ${jwtSecret.substring(0, 20)}...`);
console.log('\n✅ JWT_SECRET is properly configured!\n');


