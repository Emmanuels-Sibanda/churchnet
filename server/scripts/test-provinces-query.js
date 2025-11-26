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

const query = `
  SELECT DISTINCT province 
  FROM venues 
  WHERE province IS NOT NULL AND province != ''
  UNION
  SELECT DISTINCT province 
  FROM churches 
  WHERE province IS NOT NULL AND province != ''
  ORDER BY province
`;

db.all(query, [], (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Provinces found:', rows.length);
    rows.forEach(r => console.log('  -', r.province));
  }
  db.close();
});

