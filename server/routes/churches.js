const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Get all churches
router.get('/', (req, res) => {
  const database = db.getDb();
  database.all(
    'SELECT id, name, email, phone, city, province, description, created_at FROM churches ORDER BY name',
    [],
    (err, churches) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(churches);
    }
  );
});

// Get single church
router.get('/:id', (req, res) => {
  const database = db.getDb();
  database.get(
    'SELECT id, name, email, phone, address, city, province, zip_code, description, created_at FROM churches WHERE id = ?',
    [req.params.id],
    (err, church) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!church) {
        return res.status(404).json({ error: 'Church not found' });
      }
      res.json(church);
    }
  );
});

module.exports = router;

