const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database', 'venue_hiring.db');

console.log('=== Adding Sample Venues and Equipment ===\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// First, get the admin church ID
db.get('SELECT id FROM churches WHERE email = ?', ['admin@church.com'], (err, adminChurch) => {
  if (err) {
    console.error('Error finding admin church:', err);
    db.close();
    return;
  }

  if (!adminChurch) {
    console.error('Admin church not found!');
    db.close();
    return;
  }

  const churchId = adminChurch.id;
  console.log(`Using church ID: ${churchId}\n`);

  // Sample venues
  const sampleVenues = [
    {
      name: 'Main Hall',
      description: 'Spacious main hall perfect for conferences, weddings, and large gatherings. Features modern sound system and lighting.',
      capacity: 200,
      price_per_hour: 500,
      price_per_half_day: 2000,
      price_per_day: 3500,
      address: '123 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      zip_code: '0001',
      amenities: JSON.stringify(['wifi', 'parking', 'restrooms']),
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Conference Room',
      description: 'Intimate conference room ideal for meetings and small workshops. Equipped with projector and whiteboard.',
      capacity: 30,
      price_per_hour: 300,
      price_per_half_day: 1200,
      price_per_day: 2000,
      address: '123 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      zip_code: '0001',
      amenities: JSON.stringify(['wifi', 'parking']),
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Outdoor Garden',
      description: 'Beautiful outdoor garden space perfect for ceremonies, picnics, and outdoor events. Includes covered area.',
      capacity: 150,
      price_per_hour: 400,
      price_per_half_day: 1500,
      price_per_day: 2500,
      address: '123 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      zip_code: '0001',
      amenities: JSON.stringify(['parking', 'restrooms']),
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Youth Hall',
      description: 'Modern youth hall with stage, sound system, and flexible seating. Great for concerts and youth events.',
      capacity: 100,
      price_per_hour: 350,
      price_per_half_day: 1300,
      price_per_day: 2200,
      address: '123 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      zip_code: '0001',
      amenities: JSON.stringify(['wifi', 'parking', 'restrooms']),
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Chapel',
      description: 'Elegant chapel perfect for intimate ceremonies and small gatherings. Features beautiful stained glass windows.',
      capacity: 50,
      price_per_hour: 250,
      price_per_half_day: 900,
      price_per_day: 1500,
      address: '123 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      zip_code: '0001',
      amenities: JSON.stringify(['parking']),
      images: JSON.stringify([]),
      is_available: 1
    }
  ];

  // Sample equipment
  const sampleEquipment = [
    {
      name: 'Sound System',
      description: 'Professional PA system with microphones, speakers, and mixer. Perfect for events and presentations.',
      category: 'Audio',
      price_per_hour: 150,
      price_per_day: 800,
      quantity: 2,
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Projector',
      description: 'HD projector with screen. Ideal for presentations and movie screenings.',
      category: 'Visual',
      price_per_hour: 100,
      price_per_day: 500,
      quantity: 3,
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Tables',
      description: 'Folding tables (seats 8). Available in sets of 10.',
      category: 'Furniture',
      price_per_hour: 50,
      price_per_day: 200,
      quantity: 30,
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Chairs',
      description: 'Comfortable folding chairs. Available in sets of 50.',
      category: 'Furniture',
      price_per_hour: 30,
      price_per_day: 150,
      quantity: 200,
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Stage Platform',
      description: 'Modular stage platform (2m x 2m sections). Can be configured to various sizes.',
      category: 'Stage',
      price_per_hour: 200,
      price_per_day: 1000,
      quantity: 8,
      images: JSON.stringify([]),
      is_available: 1
    },
    {
      name: 'Lighting Kit',
      description: 'Professional lighting kit with stands, LED lights, and control board.',
      category: 'Lighting',
      price_per_hour: 120,
      price_per_day: 600,
      quantity: 1,
      images: JSON.stringify([]),
      is_available: 1
    }
  ];

  let venuesAdded = 0;
  let equipmentAdded = 0;

  // Add venues
  console.log('Adding venues...');
  sampleVenues.forEach((venue, index) => {
    db.run(
      `INSERT INTO venues (church_id, name, description, capacity, price_per_hour, price_per_half_day, price_per_day, address, city, province, zip_code, amenities, images, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        churchId,
        venue.name,
        venue.description,
        venue.capacity,
        venue.price_per_hour,
        venue.price_per_half_day,
        venue.price_per_day,
        venue.address,
        venue.city,
        venue.province,
        venue.zip_code,
        venue.amenities,
        venue.images,
        venue.is_available
      ],
      function(err) {
        if (err) {
          console.error(`Error adding venue "${venue.name}":`, err.message);
        } else {
          venuesAdded++;
          console.log(`✓ Added venue: ${venue.name}`);
        }

        // After all venues are processed
        if (index === sampleVenues.length - 1) {
          console.log(`\nAdded ${venuesAdded} venues\n`);

          // Add equipment
          console.log('Adding equipment...');
          sampleEquipment.forEach((item, eqIndex) => {
            db.run(
              `INSERT INTO equipment (church_id, name, description, category, price_per_hour, price_per_day, quantity, images, is_available)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                churchId,
                item.name,
                item.description,
                item.category,
                item.price_per_hour,
                item.price_per_day,
                item.quantity,
                item.images,
                item.is_available
              ],
              function(err) {
                if (err) {
                  console.error(`Error adding equipment "${item.name}":`, err.message);
                } else {
                  equipmentAdded++;
                  console.log(`✓ Added equipment: ${item.name}`);
                }

                // After all equipment is processed
                if (eqIndex === sampleEquipment.length - 1) {
                  console.log(`\nAdded ${equipmentAdded} equipment items\n`);
                  console.log('=== Sample Data Added Successfully ===');
                  console.log(`Total venues: ${venuesAdded}`);
                  console.log(`Total equipment: ${equipmentAdded}`);
                  db.close();
                }
              }
            );
          });
        }
      }
    );
  });
});

