const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Check if state column exists
db.all('PRAGMA table_info(venues)', (err, columns) => {
  if (err) {
    console.error('Error checking columns:', err);
    db.close();
    return;
  }

  const hasState = columns.some(c => c.name === 'state');
  const hasProvince = columns.some(c => c.name === 'province');

  if (hasState && !hasProvince) {
    console.log('Migrating venues table: state -> province');
    
    // SQLite doesn't support ALTER TABLE RENAME COLUMN in older versions
    // So we need to recreate the table
    db.serialize(() => {
      // Drop venues_new if it exists from previous failed migration
      db.run('DROP TABLE IF EXISTS venues_new', (err) => {
        if (err) console.error('Error dropping venues_new:', err);
      });
      
      // Create new table with province
      db.run(`CREATE TABLE venues_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        church_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        capacity INTEGER,
        price_per_hour DECIMAL(10, 2) NOT NULL,
        price_per_half_day DECIMAL(10, 2),
        price_per_day DECIMAL(10, 2),
        address TEXT,
        city TEXT,
        province TEXT,
        zip_code TEXT,
        amenities TEXT,
        images TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (church_id) REFERENCES churches(id)
      )`);

      // Copy data - check which columns exist in old table
      const oldHasHalfDay = columns.some(c => c.name === 'price_per_half_day');
      const halfDaySelect = oldHasHalfDay ? 'price_per_half_day' : 'NULL';
      
      db.run(`INSERT INTO venues_new 
        (id, church_id, name, description, capacity, price_per_hour, price_per_half_day, price_per_day,
         address, city, province, zip_code, amenities, images, is_available, created_at)
        SELECT 
        id, church_id, name, description, capacity, price_per_hour, ${halfDaySelect}, price_per_day,
        address, city, state, zip_code, amenities, images, is_available, created_at
        FROM venues`, (err) => {
        if (err) {
          console.error('Error copying data:', err);
          db.close();
          return;
        }

        // Drop old table
        db.run('DROP TABLE venues', (err) => {
          if (err) {
            console.error('Error dropping old table:', err);
            db.close();
            return;
          }

          // Rename new table
          db.run('ALTER TABLE venues_new RENAME TO venues', (err) => {
            if (err) {
              console.error('Error renaming table:', err);
            } else {
              console.log('✓ Migration completed successfully');
            }
            db.close();
          });
        });
      });
    });
  } else if (hasProvince) {
    console.log('Venues table already has province column');
    db.close();
  } else {
    console.log('Neither state nor province column found - table may need to be recreated');
    db.close();
  }
});

