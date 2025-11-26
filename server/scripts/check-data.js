const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');

console.log('=== Checking Database Contents ===\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// Check venues
db.all('SELECT id, name, church_id, is_available FROM venues', [], (err, venues) => {
  if (err) {
    console.error('Error fetching venues:', err);
  } else {
    console.log(`Venues: ${venues.length} total`);
    if (venues.length > 0) {
      console.log('Sample venues:');
      venues.slice(0, 5).forEach(v => {
        console.log(`  - ID: ${v.id}, Name: ${v.name}, Church ID: ${v.church_id}, Available: ${v.is_available}`);
      });
    }
  }
  
  // Check equipment
  db.all('SELECT id, name, church_id, is_available FROM equipment', [], (err, equipment) => {
    if (err) {
      console.error('Error fetching equipment:', err);
    } else {
      console.log(`\nEquipment: ${equipment.length} total`);
      if (equipment.length > 0) {
        console.log('Sample equipment:');
        equipment.slice(0, 5).forEach(e => {
          console.log(`  - ID: ${e.id}, Name: ${e.name}, Church ID: ${e.church_id}, Available: ${e.is_available}`);
        });
      }
    }
    
    // Check churches
    db.all('SELECT id, name, email FROM churches', [], (err, churches) => {
      if (err) {
        console.error('Error fetching churches:', err);
      } else {
        console.log(`\nChurches: ${churches.length} total`);
        if (churches.length > 0) {
          console.log('Sample churches:');
          churches.slice(0, 5).forEach(c => {
            console.log(`  - ID: ${c.id}, Name: ${c.name}, Email: ${c.email}`);
          });
        }
      }
      
      // Check available venues (is_available = 1)
      db.all('SELECT COUNT(*) as count FROM venues WHERE is_available = 1', [], (err, row) => {
        if (err) {
          console.error('Error counting available venues:', err);
        } else {
          console.log(`\nAvailable venues: ${row[0].count}`);
        }
        
        db.close();
      });
    });
  });
});

