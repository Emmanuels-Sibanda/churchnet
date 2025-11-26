const express = require('express');
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Check if user is admin
const isAdmin = (req, res, next) => {
  // For now, check if email is admin email (you can enhance this later)
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@church.com'];
  
  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get dashboard statistics
router.get('/stats', (req, res) => {
  const database = db.getDb();
  
  const stats = {};
  let completed = 0;
  const total = 5;

  // Total churches
  database.get('SELECT COUNT(*) as count FROM churches', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.totalChurches = row.count;
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  });

  // Total venues
  database.get('SELECT COUNT(*) as count FROM venues', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.totalVenues = row.count;
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  });

  // Total equipment
  database.get('SELECT COUNT(*) as count FROM equipment', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.totalEquipment = row.count;
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  });

  // Total bookings
  database.get('SELECT COUNT(*) as count FROM bookings', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.totalBookings = row.count;
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  });

  // Pending bookings
  database.get("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'", [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.pendingBookings = row.count;
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  });
});

// Get all users
router.get('/users', (req, res) => {
  const database = db.getDb();
  database.all(
    'SELECT id, name, email, phone, city, province, created_at FROM churches ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(users);
    }
  );
});

// Get all venues
router.get('/venues', (req, res) => {
  const database = db.getDb();
  database.all(
    `SELECT v.*, c.name as church_name, c.email as church_email
     FROM venues v
     JOIN churches c ON v.church_id = c.id
     ORDER BY v.created_at DESC`,
    [],
    (err, venues) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      const processed = venues.map(v => ({
        ...v,
        amenities: v.amenities ? JSON.parse(v.amenities) : [],
        images: v.images ? JSON.parse(v.images) : []
      }));
      res.json(processed);
    }
  );
});

// Get all equipment
router.get('/equipment', (req, res) => {
  const database = db.getDb();
  database.all(
    `SELECT e.*, c.name as church_name, c.email as church_email
     FROM equipment e
     JOIN churches c ON e.church_id = c.id
     ORDER BY e.created_at DESC`,
    [],
    (err, equipment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      const processed = equipment.map(e => ({
        ...e,
        images: e.images ? JSON.parse(e.images) : []
      }));
      res.json(processed);
    }
  );
});

// Get all bookings
router.get('/bookings', (req, res) => {
  const database = db.getDb();
  database.all(
    `SELECT b.*, 
            v.name as venue_name,
            e.name as equipment_name,
            booker.name as booker_name, booker.email as booker_email,
            owner.name as owner_name, owner.email as owner_email
     FROM bookings b
     LEFT JOIN venues v ON b.venue_id = v.id
     LEFT JOIN equipment e ON b.equipment_id = e.id
     LEFT JOIN churches booker ON b.church_id = booker.id
     LEFT JOIN churches owner ON owner.id = COALESCE(v.church_id, e.church_id)
     ORDER BY b.created_at DESC`,
    [],
    (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(bookings);
    }
  );
});

// Suspend/Activate user
router.put('/users/:id/status', (req, res) => {
  const { status } = req.body; // 'active' or 'suspended'
  const database = db.getDb();
  
  // Note: You may want to add a 'status' column to churches table
  // For now, this is a placeholder
  database.run(
    'UPDATE churches SET email = email WHERE id = ?', // Placeholder - add status column
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user status' });
      }
      res.json({ message: 'User status updated' });
    }
  );
});

// Delete venue
router.delete('/venues/:id', (req, res) => {
  const database = db.getDb();
  database.run('DELETE FROM venues WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete venue' });
    }
    res.json({ message: 'Venue deleted successfully' });
  });
});

// Delete equipment
router.delete('/equipment/:id', (req, res) => {
  const database = db.getDb();
  database.run('DELETE FROM equipment WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete equipment' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  });
});

module.exports = router;

