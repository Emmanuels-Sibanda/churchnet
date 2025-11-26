const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { generateToken } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../services/email-smtp');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Format validation errors for better frontend display
      const errorMessages = errors.array().map(err => ({
        field: err.path,
        msg: err.msg
      }));
      return res.status(400).json({ 
        error: errorMessages.map(e => e.msg).join('. '),
        errors: errorMessages
      });
    }

    // Extract only the fields we need (ignore privacy_accepted, privacy_accepted_date, confirmPassword, etc.)
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      city, 
      province, 
      zip_code, 
      description 
    } = req.body;
    
    // Log request for debugging (remove in production)
    console.log('\n=== REGISTRATION REQUEST ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Has Password:', !!password);
    console.log('Phone:', phone || null);
    console.log('City:', city || null);
    console.log('Province:', province || null);
    console.log('============================\n');
    
    // Get database connection with error handling
    let database;
    try {
      database = db.getDb();
    } catch (dbError) {
      console.error('Database not initialized:', dbError);
      return res.status(500).json({ error: 'Database not available. Please try again.', details: dbError.message });
    }

    // Check if church already exists
    database.get('SELECT * FROM churches WHERE email = ?', [email], (err, existingChurch) => {
      if (err) {
        console.error('Database error checking existing church:', err);
        console.error('Error details:', err.message, err.code);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (existingChurch) {
        return res.status(400).json({ error: 'Church with this email already exists' });
      }

      // Hash password and insert (using async/await in IIFE to avoid callback issues)
      (async () => {
        try {
          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new church
        database.run(
          'INSERT INTO churches (name, email, password, phone, address, city, province, zip_code, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [name, email, hashedPassword, phone || null, address || null, city || null, province || null, zip_code || null, description || null],
          function(insertErr) {
            if (insertErr) {
              console.error('Database error inserting church:', insertErr);
              console.error('Insert error details:', insertErr.message, insertErr.code);
              if (!res.headersSent) {
                return res.status(500).json({ error: 'Failed to register church', details: insertErr.message });
              }
              return;
            }

            try {
              const churchId = this.lastID;
              const token = generateToken({ id: churchId, email, name });
              
              // Send welcome email (non-blocking, don't let it break registration)
              sendWelcomeEmail(email, name).catch(emailErr => {
                console.error('Failed to send welcome email (non-critical):', emailErr?.message || emailErr);
              });
              
              if (!res.headersSent) {
                res.status(201).json({
                  token,
                  church: {
                    id: churchId,
                    name,
                    email,
                    phone,
                    city,
                    province
                  }
                });
              }
            } catch (tokenError) {
              console.error('Error generating token:', tokenError);
              console.error('Token error stack:', tokenError.stack);
              if (!res.headersSent) {
                return res.status(500).json({ error: 'Failed to generate authentication token', details: tokenError.message });
              }
            }
          }
        );
        } catch (hashError) {
          console.error('Error hashing password:', hashError);
          console.error('Hash error stack:', hashError.stack);
          if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to process password', details: hashError.message });
          }
        }
      })();
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR (OUTER CATCH) ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('========================================');
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Server error', 
        details: error.message,
        type: error.constructor.name
      });
    }
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const database = db.getDb();

    database.get('SELECT * FROM churches WHERE email = ?', [email], async (err, church) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!church) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, church.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({ id: church.id, email: church.email, name: church.name });
      res.json({
        token,
        church: {
          id: church.id,
          name: church.name,
          email: church.email,
          phone: church.phone,
          city: church.city,
          province: church.province
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

