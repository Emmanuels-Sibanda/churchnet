const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');
const { 
  sendBookingRequestToOwner, 
  sendBookingRequestToBooker,
  sendBookingApproval,
  sendBookingRejection
} = require('../services/email-smtp');

const router = express.Router();

// Get all bookings (authenticated)
router.get('/', authenticate, (req, res) => {
  const database = db.getDb();
  const query = `
    SELECT b.*, 
           v.name as venue_name, v.price_per_hour as venue_price,
           e.name as equipment_name, e.price_per_hour as equipment_price,
           c.name as church_name
    FROM bookings b
    LEFT JOIN venues v ON b.venue_id = v.id
    LEFT JOIN equipment e ON b.equipment_id = e.id
    JOIN churches c ON b.church_id = c.id
    WHERE b.church_id = ?
    ORDER BY b.created_at DESC
  `;

  database.all(query, [req.user.id], (err, bookings) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(bookings);
  });
});

// Get bookings for my listings (authenticated)
router.get('/my-listings', authenticate, (req, res) => {
  const database = db.getDb();
  const query = `
    SELECT b.*, 
           v.name as venue_name, v.church_id as venue_church_id,
           e.name as equipment_name, e.church_id as equipment_church_id,
           c.name as booking_church_name
    FROM bookings b
    LEFT JOIN venues v ON b.venue_id = v.id
    LEFT JOIN equipment e ON b.equipment_id = e.id
    JOIN churches c ON b.church_id = c.id
    WHERE (v.church_id = ? OR e.church_id = ?)
    ORDER BY b.created_at DESC
  `;

  database.all(query, [req.user.id, req.user.id], (err, bookings) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(bookings);
  });
});

// Create booking (authenticated)
router.post('/', authenticate, [
  body('booking_type').isIn(['venue', 'equipment', 'venue_with_equipment']).withMessage('Booking type must be venue, equipment, or venue_with_equipment'),
  body('start_date').notEmpty().withMessage('Start date is required'),
  body('end_date').notEmpty().withMessage('End date is required'),
  body('price_option').optional().isIn(['hourly', 'half_day', 'full_day']).withMessage('Price option must be hourly, half_day, or full_day'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { booking_type, venue_id, equipment_id, equipment_ids, start_date, end_date, price_option, notes } = req.body;
    const selectedPriceOption = price_option || 'hourly';
    const database = db.getDb();

    // Validate booking type and ID
    if ((booking_type === 'venue' || booking_type === 'venue_with_equipment') && !venue_id) {
      return res.status(400).json({ error: 'Venue ID is required for venue bookings' });
    }
    if (booking_type === 'equipment' && !equipment_id) {
      return res.status(400).json({ error: 'Equipment ID is required for equipment bookings' });
    }
    if (booking_type === 'venue_with_equipment' && (!equipment_ids || equipment_ids.length === 0)) {
      return res.status(400).json({ error: 'At least one equipment item is required for venue with equipment bookings' });
    }

    // Validate dates
    const start = new Date(start_date);
    const end = new Date(end_date);
    const now = new Date();

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Check if end date is after start date
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Check if start date is in the future
    if (start < now) {
      return res.status(400).json({ error: 'Start date must be in the future' });
    }

    // Validate time constraints: Venues are available between 7am and 6pm daily
    if (booking_type === 'venue' || booking_type === 'venue_with_equipment') {
      const startHour = start.getHours();
      const endHour = end.getHours();
      const endMinutes = end.getMinutes();

      // Check start time is between 7am (7) and 5:59pm (17)
      if (startHour < 7 || startHour >= 18) {
        return res.status(400).json({ error: 'Venues are only available between 7:00 AM and 6:00 PM daily' });
      }

      // Check end time is between 7am and 6pm (18:00)
      if (endHour < 7 || endHour > 18 || (endHour === 18 && endMinutes > 0)) {
        return res.status(400).json({ error: 'Venues are only available until 6:00 PM daily' });
      }
    }

    // Get item details and check availability
    let itemQuery, itemParams, conflictQuery, conflictParams;
    if (booking_type === 'venue') {
      itemQuery = 'SELECT price_per_hour, price_per_half_day, price_per_day, is_available FROM venues WHERE id = ?';
      itemParams = [venue_id];
      conflictQuery = `
        SELECT COUNT(*) as count FROM bookings 
        WHERE venue_id = ? 
        AND status IN ('pending', 'approved')
        AND start_date < ? AND end_date > ?
      `;
      conflictParams = [venue_id, end_date, start_date];
    } else {
      itemQuery = 'SELECT price_per_hour, price_per_day, is_available, quantity FROM equipment WHERE id = ?';
      itemParams = [equipment_id];
      conflictQuery = `
        SELECT COUNT(*) as count FROM bookings 
        WHERE equipment_id = ? 
        AND status IN ('pending', 'approved')
        AND start_date < ? AND end_date > ?
      `;
      conflictParams = [equipment_id, end_date, start_date];
    }

    database.get(itemQuery, itemParams, (err, item) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!item) {
        return res.status(404).json({ error: `${booking_type} not found` });
      }

      // Check if item is available
      if (!item.is_available) {
        return res.status(400).json({ error: `${booking_type} is not available for booking` });
      }

      // Check for booking conflicts
      database.get(conflictQuery, conflictParams, (err, conflict) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // For equipment, check if quantity is sufficient
        if (booking_type === 'equipment') {
          const bookedCount = conflict.count || 0;
          if (bookedCount >= (item.quantity || 1)) {
            return res.status(400).json({ error: 'Equipment is fully booked for the selected dates' });
          }
        } else {
          // For venues, check if there's any conflict
          if (conflict.count > 0) {
            return res.status(400).json({ error: 'Venue is already booked for the selected dates' });
          }
        }

        // Calculate total price based on price option
        let totalPrice = 0;
        const hours = (end - start) / (1000 * 60 * 60);
        const days = hours / 24;
        
        if (booking_type === 'venue' || booking_type === 'venue_with_equipment') {
          if (selectedPriceOption === 'hourly') {
            totalPrice = (item.price_per_hour || 0) * Math.ceil(hours);
          } else if (selectedPriceOption === 'half_day') {
            totalPrice = (item.price_per_half_day || item.price_per_hour * 4 || 0);
          } else if (selectedPriceOption === 'full_day') {
            totalPrice = (item.price_per_day || item.price_per_hour * 8 || 0);
          }
        } else {
          // Equipment - use hourly for now
          totalPrice = (item.price_per_hour || item.price_per_day / 24 || 0) * Math.ceil(hours);
        }

        // Add equipment prices if booking includes equipment
        const processEquipmentAndCreate = () => {
          if (booking_type === 'venue_with_equipment' && equipment_ids && equipment_ids.length > 0) {
            // Get equipment prices
            const equipmentPlaceholders = equipment_ids.map(() => '?').join(',');
            database.all(
              `SELECT price_per_hour, price_per_day FROM equipment WHERE id IN (${equipmentPlaceholders})`,
              equipment_ids,
              (err, equipmentItems) => {
                if (!err && equipmentItems) {
                  equipmentItems.forEach(eq => {
                    const eqPrice = eq.price_per_hour || (eq.price_per_day / 24) || 0;
                    totalPrice += eqPrice * Math.ceil(hours);
                  });
                }
                createBooking();
              }
            );
          } else {
            createBooking();
          }
        };

        processEquipmentAndCreate();

        function createBooking() {
          // Get booker details first
          database.get('SELECT name, email FROM churches WHERE id = ?', [req.user.id], (err, booker) => {
            if (err) {
              console.error('Error fetching booker details:', err);
            }

            // Get venue/equipment owner details
            let ownerQuery, ownerParams;
            if (venue_id) {
              ownerQuery = `SELECT v.name as item_name, c.name as owner_name, c.email as owner_email
                           FROM venues v
                           JOIN churches c ON v.church_id = c.id
                           WHERE v.id = ?`;
              ownerParams = [venue_id];
            } else if (equipment_id) {
              ownerQuery = `SELECT e.name as item_name, c.name as owner_name, c.email as owner_email
                           FROM equipment e
                           JOIN churches c ON e.church_id = c.id
                           WHERE e.id = ?`;
              ownerParams = [equipment_id];
            } else {
              ownerQuery = null;
            }

            // Get owner details if needed
            if (ownerQuery) {
              database.get(ownerQuery, ownerParams, (err, owner) => {
                createBookingRecord(booker, owner);
              });
            } else {
              createBookingRecord(booker, null);
            }

            function createBookingRecord(booker, owner) {
              // Create booking
              database.run(
                `INSERT INTO bookings (church_id, venue_id, equipment_id, booking_type, start_date, end_date, price_option, total_price, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  req.user.id,
                  (booking_type === 'venue' || booking_type === 'venue_with_equipment') ? venue_id : null,
                  booking_type === 'equipment' ? equipment_id : null,
                  booking_type,
                  start_date,
                  end_date,
                  selectedPriceOption,
                  totalPrice,
                  notes || null
                ],
                function(err) {
                  if (err) {
                    return res.status(500).json({ error: 'Failed to create booking' });
                  }
                  
                  const bookingId = this.lastID;
                  
                  // Send email notifications (non-blocking)
                  if (booker) {
                    const itemName = owner?.item_name || 'Item';
                    const bookingDetails = {
                      venueName: itemName,
                      startDate: start_date,
                      endDate: end_date,
                      priceOption: selectedPriceOption,
                      totalPrice: totalPrice,
                      notes: notes
                    };

                    // Send to booker
                    sendBookingRequestToBooker(
                      booker.email,
                      booker.name,
                      bookingDetails
                    ).catch(err => console.error('Failed to send email to booker:', err));

                    // Send to owner (if venue/equipment booking)
                    if (owner && owner.owner_email) {
                      sendBookingRequestToOwner(
                        owner.owner_email,
                        owner.owner_name,
                        {
                          ...bookingDetails,
                          bookerName: booker.name,
                          bookerEmail: booker.email
                        }
                      ).catch(err => console.error('Failed to send email to owner:', err));
                    }
                  }
                  
                  // If venue_with_equipment, add equipment to junction table
                  if (booking_type === 'venue_with_equipment' && equipment_ids && equipment_ids.length > 0) {
                    const equipmentStmt = database.prepare(
                      'INSERT INTO booking_equipment (booking_id, equipment_id, quantity) VALUES (?, ?, 1)'
                    );
                    
                    let inserted = 0;
                    equipment_ids.forEach(eqId => {
                      equipmentStmt.run([bookingId, eqId], (err) => {
                        if (err) {
                          console.error('Error adding equipment to booking:', err);
                        }
                        inserted++;
                        if (inserted === equipment_ids.length) {
                          equipmentStmt.finalize();
                          res.status(201).json({ id: bookingId, message: 'Booking created successfully' });
                        }
                      });
                    });
                  } else {
                    res.status(201).json({ id: bookingId, message: 'Booking created successfully' });
                  }
                }
              );
            }
          });
        }
      });
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status (authenticated, for listing owners)
router.put('/:id/status', authenticate, [
  body('status').isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const database = db.getDb();

    // Check if user owns the listing and get booking details for email
    database.get(
      `SELECT b.*, 
              v.church_id as venue_church_id, v.name as venue_name,
              e.church_id as equipment_church_id, e.name as equipment_name,
              booker.name as booker_name, booker.email as booker_email,
              owner.name as owner_name, owner.email as owner_email
       FROM bookings b
       LEFT JOIN venues v ON b.venue_id = v.id
       LEFT JOIN equipment e ON b.equipment_id = e.id
       LEFT JOIN churches booker ON b.church_id = booker.id
       LEFT JOIN churches owner ON owner.id = COALESCE(v.church_id, e.church_id)
       WHERE b.id = ?`,
      [req.params.id],
      (err, booking) => {
        if (err || !booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }

        const ownerId = booking.venue_church_id || booking.equipment_church_id;
        if (ownerId !== req.user.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }

        database.run(
          'UPDATE bookings SET status = ? WHERE id = ?',
          [status, req.params.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update booking' });
            }

            // Send email notification based on status (non-blocking)
            if (booking.booker_email && booking.booker_name) {
              const bookingDetails = {
                venueName: booking.venue_name || booking.equipment_name || 'Item',
                startDate: booking.start_date,
                endDate: booking.end_date,
                priceOption: booking.price_option,
                totalPrice: booking.total_price
              };

              if (status === 'approved') {
                sendBookingApproval(
                  booking.booker_email,
                  booking.booker_name,
                  bookingDetails
                ).catch(err => console.error('Failed to send approval email:', err));
              } else if (status === 'rejected') {
                sendBookingRejection(
                  booking.booker_email,
                  booking.booker_name,
                  bookingDetails
                ).catch(err => console.error('Failed to send rejection email:', err));
              }
            }

            res.json({ message: 'Booking status updated successfully' });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

