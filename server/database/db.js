const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'venue_hiring.db');

let db;
let isInitialized = false;
let initPromise = null;

// Configure SQLite for better concurrency
const configureDatabase = (database) => {
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Enable WAL mode for better concurrency
      database.run('PRAGMA journal_mode = WAL', (err) => {
        if (err) {
          console.warn('Warning: Could not enable WAL mode:', err);
        } else {
          console.log('WAL mode enabled for better concurrency');
        }
      });
      
      // Set busy timeout to handle locked database gracefully (5 seconds)
      database.run('PRAGMA busy_timeout = 5000', (err) => {
        if (err) {
          console.warn('Warning: Could not set busy timeout:', err);
        } else {
          console.log('Busy timeout set to 5000ms');
        }
      });
      
      // Enable foreign keys
      database.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.warn('Warning: Could not enable foreign keys:', err);
        }
      });
      
      // Optimize for concurrent reads
      database.run('PRAGMA synchronous = NORMAL', (err) => {
        if (err) {
          console.warn('Warning: Could not set synchronous mode:', err);
        }
        resolve();
      });
    });
  });
};

const init = () => {
  // Return existing promise if initialization is in progress
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = new Promise((resolve, reject) => {
    // Close existing connection if any
    if (db) {
      db.close((closeErr) => {
        if (closeErr) console.warn('Error closing existing DB connection:', closeErr);
      });
    }
    
    // Open database with WAL mode for better concurrency
    db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        initPromise = null;
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      
      configureDatabase(db).then(() => {
        createTables().then(() => {
          isInitialized = true;
          initPromise = null;
          resolve();
        }).catch((createErr) => {
          initPromise = null;
          reject(createErr);
        });
      }).catch((configErr) => {
        initPromise = null;
        reject(configErr);
      });
    });
    
    // Handle database errors
    db.on('error', (err) => {
      console.error('Database error:', err);
      // Don't close the connection on error, let it recover
    });
  });
  
  return initPromise;
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Churches table
      db.run(`CREATE TABLE IF NOT EXISTS churches (
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
      )`);

      // Venues table
      db.run(`CREATE TABLE IF NOT EXISTS venues (
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

      // Equipment table
      db.run(`CREATE TABLE IF NOT EXISTS equipment (
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
      )`);

      // Bookings table
      db.run(`CREATE TABLE IF NOT EXISTS bookings (
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
      )`);

      // Booking equipment junction table for multiple equipment items per booking
      db.run(`CREATE TABLE IF NOT EXISTS booking_equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        equipment_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id)
      )`);

      // Create default admin church for testing
      db.get('SELECT * FROM churches WHERE email = ?', ['admin@church.com'], (err, row) => {
        if (err) {
          console.error('Error checking admin:', err);
          reject(err);
          return;
        }
        if (!row) {
          const hashedPassword = bcrypt.hashSync('admin123', 10);
          db.run(
            'INSERT INTO churches (name, email, password, phone, city, province) VALUES (?, ?, ?, ?, ?, ?)',
            ['Admin Church', 'admin@church.com', hashedPassword, '123-456-7890', 'Sample City', 'Gauteng'],
            (err) => {
              if (err) {
                console.error('Error creating admin:', err);
                reject(err);
              } else {
                console.log('Default admin church created');
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    });
  });
};

const getDb = () => {
  if (!db || !isInitialized) {
    console.error('Database not initialized! Call db.init() first.');
    throw new Error('Database not initialized');
  }
  return db;
};

// Helper function to execute queries with retry logic for locked database
const executeWithRetry = (queryFn, maxRetries = 3, delay = 100) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const attempt = () => {
      attempts++;
      try {
        queryFn((err, result) => {
          if (err) {
            // Check if it's a database locked error
            if (err.code === 'SQLITE_BUSY' && attempts < maxRetries) {
              console.warn(`Database busy, retrying (${attempts}/${maxRetries})...`);
              setTimeout(attempt, delay * attempts);
            } else {
              reject(err);
            }
          } else {
            resolve(result);
          }
        });
      } catch (err) {
        if (err.code === 'SQLITE_BUSY' && attempts < maxRetries) {
          console.warn(`Database busy, retrying (${attempts}/${maxRetries})...`);
          setTimeout(attempt, delay * attempts);
        } else {
          reject(err);
        }
      }
    };
    
    attempt();
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  init,
  getDb,
  close,
  executeWithRetry
};

