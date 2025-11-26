const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get my venues (authenticated)
router.get('/my-venues', authenticate, (req, res) => {
  const database = db.getDb();
  database.all(
    `SELECT v.*, c.name as church_name, c.city as church_city, c.province as church_province
     FROM venues v
     JOIN churches c ON v.church_id = c.id
     WHERE v.church_id = ?
     ORDER BY v.created_at DESC`,
    [req.user.id],
    (err, venues) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(venues.map(v => ({
        ...v,
        amenities: v.amenities ? JSON.parse(v.amenities) : [],
        images: v.images ? JSON.parse(v.images) : []
      })));
    }
  );
});

// Get all venues (with optional filters)
router.get('/', [
  query('city').optional().trim(),
  query('province').optional().trim(),
  query('minCapacity').optional().trim().custom((value) => {
    if (value === '' || value === undefined) return true;
    return !isNaN(value) && Number.isInteger(Number(value));
  }).withMessage('Min capacity must be a number'),
  query('maxPrice').optional().trim().custom((value) => {
    if (value === '' || value === undefined) return true;
    return !isNaN(value) && !isNaN(parseFloat(value));
  }).withMessage('Max price must be a number'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { city, province, minCapacity, maxPrice } = req.query;
    const database = db.getDb();
    
    if (!database) {
      console.error('Database connection is null');
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    let sqlQuery = `
      SELECT v.*, c.name as church_name, c.city as church_city, c.province as church_province
      FROM venues v
      JOIN churches c ON v.church_id = c.id
      WHERE v.is_available = 1
    `;
    const params = [];

    if (city) {
      sqlQuery += ' AND (v.city LIKE ? OR c.city LIKE ?)';
      params.push(`%${city}%`, `%${city}%`);
    }
    if (province) {
      sqlQuery += ' AND (v.province LIKE ? OR c.province LIKE ?)';
      params.push(`%${province}%`, `%${province}%`);
    }
    if (minCapacity) {
      sqlQuery += ' AND v.capacity >= ?';
      params.push(minCapacity);
    }
    if (maxPrice) {
      sqlQuery += ' AND v.price_per_hour <= ?';
      params.push(maxPrice);
    }

    sqlQuery += ' ORDER BY v.created_at DESC';

    database.all(sqlQuery, params, (err, venues) => {
      if (err) {
        console.error('=== VENUES QUERY ERROR ===');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('SQL Query:', sqlQuery);
        console.error('Params:', params);
        console.error('==========================');
        return res.status(500).json({ 
          error: 'Database error', 
          details: err.message,
          code: err.code,
          hint: 'Check server console for full error details'
        });
      }
      
      if (!venues) {
        venues = [];
      }
      
      try {
        const processedVenues = venues.map(v => {
          try {
            let amenities = [];
            let images = [];
            
            if (v.amenities) {
              if (typeof v.amenities === 'string') {
                try {
                  amenities = JSON.parse(v.amenities);
                } catch (e) {
                  console.warn('Failed to parse amenities for venue', v.id, e);
                  amenities = [];
                }
              } else if (Array.isArray(v.amenities)) {
                amenities = v.amenities;
              }
            }
            
            if (v.images) {
              if (typeof v.images === 'string') {
                try {
                  images = JSON.parse(v.images);
                } catch (e) {
                  console.warn('Failed to parse images for venue', v.id, e);
                  images = [];
                }
              } else if (Array.isArray(v.images)) {
                images = v.images;
              }
            }
            
            return {
              ...v,
              amenities,
              images
            };
          } catch (itemErr) {
            console.error('Error processing venue item:', itemErr, v);
            return {
              ...v,
              amenities: [],
              images: []
            };
          }
        });
        
        res.json(processedVenues);
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        res.status(500).json({ error: 'Data processing error', details: parseErr.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single venue
router.get('/:id', (req, res) => {
  const database = db.getDb();
  database.get(
    `SELECT v.*, c.name as church_name, c.phone as church_phone, c.email as church_email,
     c.city as church_city, c.province as church_province, c.address as church_address
     FROM venues v
     JOIN churches c ON v.church_id = c.id
     WHERE v.id = ?`,
    [req.params.id],
    (err, venue) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.json({
        ...venue,
        amenities: venue.amenities ? JSON.parse(venue.amenities) : [],
        images: venue.images ? JSON.parse(venue.images) : []
      });
    }
  );
});

// Create venue (authenticated)
router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Name is required'),
  body('price_per_hour').isFloat({ min: 0 }).withMessage('Valid price is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, description, capacity, price_per_hour, price_per_half_day, price_per_day,
      address, city, province, zip_code, amenities, images
    } = req.body;

    const database = db.getDb();
    database.run(
      `INSERT INTO venues (church_id, name, description, capacity, price_per_hour, price_per_half_day, price_per_day,
       address, city, province, zip_code, amenities, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name,
        description || null,
        capacity || null,
        price_per_hour,
        price_per_half_day || null,
        price_per_day || null,
        address || null,
        city || null,
        province || null,
        zip_code || null,
        amenities ? JSON.stringify(amenities) : null,
        images ? JSON.stringify(images) : null
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create venue' });
        }
        res.status(201).json({ id: this.lastID, message: 'Venue created successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update venue (authenticated, own venue only)
router.put('/:id', authenticate, (req, res) => {
  const database = db.getDb();
  // Check ownership
  database.get('SELECT church_id FROM venues WHERE id = ?', [req.params.id], (err, venue) => {
    if (err || !venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    if (venue.church_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const {
      name, description, capacity, price_per_hour, price_per_half_day, price_per_day,
      address, city, province, zip_code, amenities, images, is_available
    } = req.body;

    database.run(
      `UPDATE venues SET name = ?, description = ?, capacity = ?, price_per_hour = ?,
       price_per_half_day = ?, price_per_day = ?, address = ?, city = ?, province = ?, zip_code = ?,
       amenities = ?, images = ?, is_available = ?
       WHERE id = ?`,
      [
        name, description, capacity, price_per_hour, price_per_half_day, price_per_day,
        address, city, province, zip_code,
        amenities ? JSON.stringify(amenities) : null,
        images ? JSON.stringify(images) : null,
        is_available !== undefined ? is_available : 1,
        req.params.id
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update venue' });
        }
        res.json({ message: 'Venue updated successfully' });
      }
    );
  });
});

// Delete venue (authenticated, own venue only)
router.delete('/:id', authenticate, (req, res) => {
  const database = db.getDb();
  database.get('SELECT church_id FROM venues WHERE id = ?', [req.params.id], (err, venue) => {
    if (err || !venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    if (venue.church_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    database.run('DELETE FROM venues WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete venue' });
      }
      res.json({ message: 'Venue deleted successfully' });
    });
  });
});

module.exports = router;

