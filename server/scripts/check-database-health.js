const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');

console.log('=== Database Health Check ===\n');

if (!fs.existsSync(DB_PATH)) {
  console.log('❌ Database file not found!');
  process.exit(1);
}

const stats = fs.statSync(DB_PATH);
console.log(`Database file size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`Last modified: ${stats.mtime}\n`);

let db;
let isHealthy = true;

try {
  db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('❌ Cannot open database:', err.message);
      isHealthy = false;
      process.exit(1);
    }
    console.log('✓ Database can be opened');
  });

  // Test basic query
  db.get('SELECT 1 as test', [], (err, row) => {
    if (err) {
      console.error('❌ Basic query failed:', err.message);
      isHealthy = false;
    } else {
      console.log('✓ Basic query works');
    }
    
    // Check integrity
    db.get('PRAGMA integrity_check', [], (err, row) => {
      if (err) {
        console.error('❌ Integrity check failed:', err.message);
        isHealthy = false;
      } else {
        const result = row.integrity_check;
        if (result === 'ok') {
          console.log('✓ Database integrity: OK');
        } else {
          console.error('❌ Database integrity issues:', result);
          isHealthy = false;
        }
      }
      
      // Check WAL mode
      db.get('PRAGMA journal_mode', [], (err, row) => {
        if (err) {
          console.error('❌ Cannot check journal mode:', err.message);
        } else {
          const mode = row.journal_mode;
          if (mode === 'wal') {
            console.log('✓ Journal mode: WAL (good for concurrency)');
          } else {
            console.log(`⚠️  Journal mode: ${mode} (consider enabling WAL)`);
          }
        }
        
        // Check busy timeout
        db.get('PRAGMA busy_timeout', [], (err, row) => {
          if (err) {
            console.error('❌ Cannot check busy timeout:', err.message);
          } else {
            const timeout = row.busy_timeout;
            console.log(`✓ Busy timeout: ${timeout}ms`);
          }
          
          // Count records
          db.get('SELECT COUNT(*) as count FROM venues', [], (err, row) => {
            if (err) {
              console.error('❌ Cannot count venues:', err.message);
            } else {
              console.log(`✓ Venues: ${row.count} records`);
            }
            
            db.get('SELECT COUNT(*) as count FROM churches', [], (err, row) => {
              if (err) {
                console.error('❌ Cannot count churches:', err.message);
              } else {
                console.log(`✓ Churches: ${row.count} records`);
              }
              
              db.get('SELECT COUNT(*) as count FROM equipment', [], (err, row) => {
                if (err) {
                  console.error('❌ Cannot count equipment:', err.message);
                } else {
                  console.log(`✓ Equipment: ${row.count} records`);
                }
                
                console.log('\n=== Health Check Complete ===');
                if (isHealthy) {
                  console.log('✓ Database is healthy!');
                } else {
                  console.log('❌ Database has issues - run repair-database.js');
                }
                
                db.close();
              });
            });
          });
        });
      });
    });
  });
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

