const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');
const BACKUP_PATH = path.join(__dirname, '..', 'database', `venue_hiring.backup.${Date.now()}.db`);

console.log('=== Database Repair Tool ===\n');

// Step 1: Check if database exists
if (!fs.existsSync(DB_PATH)) {
  console.log('❌ Database file not found at:', DB_PATH);
  console.log('Creating new database...');
  process.exit(1);
}

console.log('✓ Database file exists');
console.log('Database path:', DB_PATH);

// Step 2: Try to open and check integrity
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✓ Database opened successfully');
});

// Step 3: Check integrity
console.log('\n--- Checking Database Integrity ---');
db.run('PRAGMA integrity_check', (err, result) => {
  if (err) {
    console.error('❌ Integrity check failed:', err.message);
  } else {
    console.log('✓ Integrity check passed');
  }
});

// Step 4: Check schema
console.log('\n--- Checking Database Schema ---');
db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, tables) => {
  if (err) {
    console.error('❌ Error checking tables:', err.message);
    db.close();
    return;
  }
  
  console.log(`✓ Found ${tables.length} tables:`, tables.map(t => t.name).join(', '));
  
  // Check each table structure
  const requiredTables = ['churches', 'venues', 'equipment', 'bookings'];
  const foundTables = tables.map(t => t.name);
  const missingTables = requiredTables.filter(t => !foundTables.includes(t));
  
  if (missingTables.length > 0) {
    console.log('⚠️  Missing tables:', missingTables.join(', '));
  } else {
    console.log('✓ All required tables exist');
  }
  
  // Check venues table columns
  db.all('PRAGMA table_info(venues)', [], (err, columns) => {
    if (err) {
      console.error('❌ Error checking venues columns:', err.message);
    } else {
      const columnNames = columns.map(c => c.name);
      console.log('\n--- Venues Table Columns ---');
      columns.forEach(c => console.log(`  ${c.name} (${c.type})`));
      
      if (columnNames.includes('state') && !columnNames.includes('province')) {
        console.log('\n⚠️  Venues table still has "state" column - needs migration');
      } else if (columnNames.includes('province')) {
        console.log('✓ Venues table has "province" column');
      }
    }
    
    // Check churches table columns
    db.all('PRAGMA table_info(churches)', [], (err, columns) => {
      if (err) {
        console.error('❌ Error checking churches columns:', err.message);
      } else {
        const columnNames = columns.map(c => c.name);
        if (columnNames.includes('state') && !columnNames.includes('province')) {
          console.log('\n⚠️  Churches table still has "state" column - needs migration');
        } else if (columnNames.includes('province')) {
          console.log('✓ Churches table has "province" column');
        }
      }
      
      // Step 5: Try a test query
      console.log('\n--- Testing Queries ---');
      db.all('SELECT COUNT(*) as count FROM venues', [], (err, rows) => {
        if (err) {
          console.error('❌ Error querying venues:', err.message);
        } else {
          console.log(`✓ Venues query works: ${rows[0].count} venues found`);
        }
        
        db.all('SELECT COUNT(*) as count FROM churches', [], (err, rows) => {
          if (err) {
            console.error('❌ Error querying churches:', err.message);
          } else {
            console.log(`✓ Churches query works: ${rows[0].count} churches found`);
          }
          
          db.all('SELECT COUNT(*) as count FROM equipment', [], (err, rows) => {
            if (err) {
              console.error('❌ Error querying equipment:', err.message);
            } else {
              console.log(`✓ Equipment query works: ${rows[0].count} equipment items found`);
            }
            
            // Step 6: Enable WAL mode
            console.log('\n--- Enabling WAL Mode ---');
            db.run('PRAGMA journal_mode = WAL', (err) => {
              if (err) {
                console.error('❌ Error enabling WAL mode:', err.message);
              } else {
                console.log('✓ WAL mode enabled');
              }
              
              // Step 7: Optimize database
              console.log('\n--- Optimizing Database ---');
              db.run('VACUUM', (err) => {
                if (err) {
                  console.error('❌ Error optimizing database:', err.message);
                } else {
                  console.log('✓ Database optimized');
                }
                
                console.log('\n=== Repair Complete ===');
                console.log('✓ Database is ready to use');
                db.close();
              });
            });
          });
        });
      });
    });
  });
});

