/**
 * Check Server and Database Status
 * Run: node check-server-status.js
 */

require('dotenv').config();
const db = require('./database/db');
const path = require('path');
const fs = require('fs');

async function checkStatus() {
  console.log('🔍 Checking Server Status...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  PORT:', process.env.PORT || 'NOT SET (default: 5000)');
  console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
  console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
  console.log('  SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
  console.log('');

  // Check database file
  const dbPath = path.join(__dirname, 'database', 'venue_hiring.db');
  console.log('💾 Database File:');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('  Path:', dbPath);
    console.log('  Exists: ✅ YES');
    console.log('  Size:', (stats.size / 1024).toFixed(2), 'KB');
    console.log('  Writable:', fs.accessSync(dbPath, fs.constants.W_OK) ? '✅ YES' : '❌ NO');
  } else {
    console.log('  Exists: ❌ NO');
    console.log('  Path:', dbPath);
  }
  console.log('');

  // Try to initialize database
  console.log('🔌 Database Connection:');
  try {
    await db.init();
    console.log('  Status: ✅ INITIALIZED');
    
    // Try a simple query
    const database = db.getDb();
    database.get('SELECT COUNT(*) as count FROM churches', [], (err, row) => {
      if (err) {
        console.log('  Query Test: ❌ FAILED');
        console.log('  Error:', err.message);
      } else {
        console.log('  Query Test: ✅ SUCCESS');
        console.log('  Churches in DB:', row.count);
      }
      process.exit(0);
    });
  } catch (error) {
    console.log('  Status: ❌ FAILED');
    console.log('  Error:', error.message);
    process.exit(1);
  }
}

checkStatus();


