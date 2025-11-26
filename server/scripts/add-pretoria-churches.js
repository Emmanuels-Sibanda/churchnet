const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');

const churches = [
  { name: 'Pretoria Central Methodist Church', email: 'central@methodist.co.za', phone: '012-345-6789', address: '123 Church Street', city: 'Pretoria', province: 'Gauteng', zip_code: '0001' },
  { name: 'St. Mary\'s Anglican Cathedral', email: 'info@stmarys.co.za', phone: '012-345-6790', address: '456 Cathedral Avenue', city: 'Pretoria', province: 'Gauteng', zip_code: '0002' },
  { name: 'Pretoria Baptist Church', email: 'contact@pretoriabaptist.co.za', phone: '012-345-6791', address: '789 Baptist Road', city: 'Pretoria', province: 'Gauteng', zip_code: '0003' },
  { name: 'Grace Bible Church Pretoria', email: 'info@gracebible.co.za', phone: '012-345-6792', address: '321 Grace Street', city: 'Pretoria', province: 'Gauteng', zip_code: '0004' },
  { name: 'Rhema Bible Church', email: 'rhema@pretoria.co.za', phone: '012-345-6793', address: '654 Rhema Boulevard', city: 'Pretoria', province: 'Gauteng', zip_code: '0005' },
  { name: 'Pretoria Presbyterian Church', email: 'presby@pretoria.co.za', phone: '012-345-6794', address: '987 Presbyterian Lane', city: 'Pretoria', province: 'Gauteng', zip_code: '0006' },
  { name: 'Hillsong Pretoria', email: 'info@hillsongpta.co.za', phone: '012-345-6795', address: '147 Hillsong Drive', city: 'Pretoria', province: 'Gauteng', zip_code: '0007' },
  { name: 'Pretoria Lutheran Church', email: 'lutheran@pretoria.co.za', phone: '012-345-6796', address: '258 Lutheran Street', city: 'Pretoria', province: 'Gauteng', zip_code: '0008' },
  { name: 'Calvary Chapel Pretoria', email: 'calvary@pretoria.co.za', phone: '012-345-6797', address: '369 Calvary Road', city: 'Pretoria', province: 'Gauteng', zip_code: '0009' },
  { name: 'Pretoria Pentecostal Church', email: 'pentecostal@pretoria.co.za', phone: '012-345-6798', address: '741 Pentecostal Avenue', city: 'Pretoria', province: 'Gauteng', zip_code: '0010' },
  { name: 'Zion Christian Church Pretoria', email: 'zion@pretoria.co.za', phone: '012-345-6799', address: '852 Zion Street', city: 'Pretoria', province: 'Gauteng', zip_code: '0011' },
  { name: 'Pretoria Reformed Church', email: 'reformed@pretoria.co.za', phone: '012-345-6800', address: '963 Reformed Boulevard', city: 'Pretoria', province: 'Gauteng', zip_code: '0012' },
  { name: 'New Life Church Pretoria', email: 'newlife@pretoria.co.za', phone: '012-345-6801', address: '159 New Life Drive', city: 'Pretoria', province: 'Gauteng', zip_code: '0013' },
  { name: 'Pretoria Community Church', email: 'community@pretoria.co.za', phone: '012-345-6802', address: '357 Community Road', city: 'Pretoria', province: 'Gauteng', zip_code: '0014' },
  { name: 'Victory Church Pretoria', email: 'victory@pretoria.co.za', phone: '012-345-6803', address: '468 Victory Lane', city: 'Pretoria', province: 'Gauteng', zip_code: '0015' }
];

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
  
  // Migrate state to province if needed
  db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='churches'", (err, row) => {
    if (!err && row && row.sql && row.sql.includes('state') && !row.sql.includes('province')) {
      console.log('Migrating churches table: state -> province');
      db.run('ALTER TABLE churches RENAME COLUMN state TO province', (err) => {
        if (err) {
          console.error('Migration error:', err);
        } else {
          console.log('Migration completed');
        }
      });
    }
  });
});

const defaultPassword = bcrypt.hashSync('church123', 10);

db.serialize(() => {
  let inserted = 0;
  let skipped = 0;

  churches.forEach((church, index) => {
    // Check if church already exists
    db.get('SELECT * FROM churches WHERE email = ?', [church.email], (err, row) => {
      if (err) {
        console.error(`Error checking church ${church.name}:`, err);
        return;
      }

      if (row) {
        console.log(`Skipping ${church.name} - already exists`);
        skipped++;
      } else {
        db.run(
          'INSERT INTO churches (name, email, password, phone, address, city, province, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [church.name, church.email, defaultPassword, church.phone, church.address, church.city, church.province, church.zip_code],
          function(err) {
            if (err) {
              console.error(`Error inserting ${church.name}:`, err);
            } else {
              console.log(`✓ Added: ${church.name} (ID: ${this.lastID})`);
              inserted++;
            }

            // Check if we're done
            if (inserted + skipped === churches.length) {
              console.log(`\nCompleted: ${inserted} churches added, ${skipped} skipped`);
              db.close();
            }
          }
        );
      }
    });
  });
});

