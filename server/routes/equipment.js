const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get my equipment (authenticated)
router.get('/my-equipment', authenticate, (req, res) => {
  const database = db.getDb();
  database.all(
    `SELECT e.*, c.name as church_name, c.city as church_city, c.province as church_province
     FROM equipment e
     JOIN churches c ON e.church_id = c.id
     WHERE e.church_id = ?
     ORDER BY e.created_at DESC`,
    [req.user.id],
    (err, equipment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(equipment.map(e => ({
        ...e,
        images: e.images ? JSON.parse(e.images) : []
      })));
    }
  );
});

// Get all equipment (with optional filters)
router.get('/', [
  query('category').optional(),
  query('maxPrice').optional().isFloat(),
], (req, res) => {
  try {
    const { category, maxPrice } = req.query;
    const database = db.getDb();
    let sqlQuery = `
      SELECT e.*, c.name as church_name, c.city as church_city, c.province as church_province
      FROM equipment e
      JOIN churches c ON e.church_id = c.id
      WHERE e.is_available = 1
    `;
    const params = [];

    if (category) {
      sqlQuery += ' AND e.category = ?';
      params.push(category);
    }
    if (maxPrice) {
      sqlQuery += ' AND (e.price_per_hour <= ? OR e.price_per_day <= ?)';
      params.push(maxPrice, maxPrice);
    }

    sqlQuery += ' ORDER BY e.created_at DESC';

    database.all(sqlQuery, params, (err, equipment) => {
      if (err) {
        console.error('=== EQUIPMENT QUERY ERROR ===');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('SQL Query:', sqlQuery);
        console.error('Params:', params);
        console.error('============================');
        return res.status(500).json({ 
          error: 'Database error', 
          details: err.message,
          code: err.code,
          hint: 'Check server console for full error details'
        });
      }
      try {
        res.json(equipment.map(e => {
          try {
            return {
              ...e,
              images: e.images ? (typeof e.images === 'string' ? JSON.parse(e.images) : e.images) : []
            };
          } catch (itemErr) {
            console.error('Error parsing equipment item:', itemErr, e);
            return {
              ...e,
              images: []
            };
          }
        }));
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        res.status(500).json({ error: 'Data processing error', details: parseErr.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single equipment
router.get('/:id', (req, res) => {
  const database = db.getDb();
  database.get(
    `SELECT e.*, c.name as church_name, c.phone as church_phone, c.email as church_email,
     c.city as church_city, c.province as church_province
     FROM equipment e
     JOIN churches c ON e.church_id = c.id
     WHERE e.id = ?`,
    [req.params.id],
    (err, equipment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
      res.json({
        ...equipment,
        images: equipment.images ? JSON.parse(equipment.images) : []
      });
    }
  );
});

// Create equipment (authenticated)
router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Name is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, description, category, price_per_hour, price_per_day,
      quantity, images
    } = req.body;

    const database = db.getDb();
    database.run(
      `INSERT INTO equipment (church_id, name, description, category, price_per_hour,
       price_per_day, quantity, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name,
        description || null,
        category || null,
        price_per_hour || null,
        price_per_day || null,
        quantity || 1,
        images ? JSON.stringify(images) : null
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create equipment' });
        }
        res.status(201).json({ id: this.lastID, message: 'Equipment created successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update equipment (authenticated, own equipment only)
router.put('/:id', authenticate, (req, res) => {
  const database = db.getDb();
  database.get('SELECT church_id FROM equipment WHERE id = ?', [req.params.id], (err, equipment) => {
    if (err || !equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    if (equipment.church_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const {
      name, description, category, price_per_hour, price_per_day,
      quantity, images, is_available
    } = req.body;

    database.run(
      `UPDATE equipment SET name = ?, description = ?, category = ?, price_per_hour = ?,
       price_per_day = ?, quantity = ?, images = ?, is_available = ?
       WHERE id = ?`,
      [
        name, description, category, price_per_hour, price_per_day,
        quantity, images ? JSON.stringify(images) : null,
        is_available !== undefined ? is_available : 1,
        req.params.id
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update equipment' });
        }
        res.json({ message: 'Equipment updated successfully' });
      }
    );
  });
});

// Delete equipment (authenticated, own equipment only)
router.delete('/:id', authenticate, (req, res) => {
  const database = db.getDb();
  database.get('SELECT church_id FROM equipment WHERE id = ?', [req.params.id], (err, equipment) => {
    if (err || !equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    if (equipment.church_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    database.run('DELETE FROM equipment WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete equipment' });
      }
      res.json({ message: 'Equipment deleted successfully' });
    });
  });
});

module.exports = router;

