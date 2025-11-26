const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');
const BACKUP_PATH = path.join(__dirname, '..', 'database', `venue_hiring.backup.${Date.now()}.db`);

console.log('=== Database Recreation Tool ===\n');
console.log('⚠️  WARNING: This will backup and recreate the database!');
console.log('All data will be preserved in the backup.\n');

// Backup existing database
if (fs.existsSync(DB_PATH)) {
  console.log('Creating backup...');
  try {
    fs.copyFileSync(DB_PATH, BACKUP_PATH);
    console.log(`✓ Backup created: ${BACKUP_PATH}`);
  } catch (err) {
    console.error('❌ Backup failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('No existing database to backup');
}

// Close any existing connections and remove old database
if (fs.existsSync(DB_PATH)) {
  try {
    fs.unlinkSync(DB_PATH);
    console.log('✓ Old database removed');
  } catch (err) {
    console.error('❌ Could not remove old database:', err.message);
    console.log('Please close any applications using the database and try again');
    process.exit(1);
  }
}

// Create new database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error creating database:', err.message);
    process.exit(1);
  }
  console.log('✓ New database created');
});

// Enable WAL mode
db.run('PRAGMA journal_mode = WAL', (err) => {
  if (err) {
    console.error('❌ Error enabling WAL mode:', err.message);
  } else {
    console.log('✓ WAL mode enabled');
  }
});

// Create tables
db.serialize(() => {
  // Churches table
  db.run(`CREATE TABLE churches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    zip_code TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating churches table:', err.message);
    } else {
      console.log('✓ Churches table created');
    }
  });

  // Venues table
  db.run(`CREATE TABLE venues (
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
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating venues table:', err.message);
    } else {
      console.log('✓ Venues table created');
    }
  });

  // Equipment table
  db.run(`CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price_per_hour DECIMAL(10, 2),
    price_per_day DECIMAL(10, 2),
    quantity INTEGER DEFAULT 1,
    images TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating equipment table:', err.message);
    } else {
      console.log('✓ Equipment table created');
    }
  });

  // Bookings table
  db.run(`CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_id INTEGER NOT NULL,
    venue_id INTEGER,
    equipment_id INTEGER,
    booking_type TEXT NOT NULL CHECK(booking_type IN ('venue', 'equipment', 'venue_with_equipment')),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    price_option TEXT DEFAULT 'hourly' CHECK(price_option IN ('hourly', 'half_day', 'full_day')),
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating bookings table:', err.message);
    } else {
      console.log('✓ Bookings table created');
    }
  });

  // Booking equipment junction table
  db.run(`CREATE TABLE booking_equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating booking_equipment table:', err.message);
    } else {
      console.log('✓ Booking equipment table created');
    }
  });

  // Create default admin church
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    'INSERT INTO churches (name, email, password, phone, city, province) VALUES (?, ?, ?, ?, ?, ?)',
    ['Admin Church', 'admin@church.com', hashedPassword, '123-456-7890', 'Sample City', 'Gauteng'],
    function(err) {
      if (err) {
        console.error('❌ Error creating admin church:', err.message);
      } else {
        console.log('✓ Default admin church created');
        console.log('  Email: admin@church.com');
        console.log('  Password: admin123');
      }
      
      // Re-add Pretoria churches
      console.log('\n--- Adding Pretoria Churches ---');
      const churches = require('./add-pretoria-churches');
      // This will be handled separately
      
      console.log('\n=== Database Recreation Complete ===');
      console.log(`✓ Backup saved to: ${BACKUP_PATH}`);
      console.log('✓ New database created with proper schema');
      console.log('\nNext steps:');
      console.log('1. Run: node server/scripts/add-pretoria-churches.js');
      console.log('2. Restart your server');
      
      db.close();
    }
  );
});

