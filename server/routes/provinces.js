const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Get all available provinces
router.get('/', (req, res) => {
  try {
    const database = db.getDb();
    
    if (!database) {
      console.error('Database not initialized');
      // Return default South African provinces as fallback
      return res.json([
        'Eastern Cape',
        'Free State',
        'Gauteng',
        'KwaZulu-Natal',
        'Limpopo',
        'Mpumalanga',
        'Northern Cape',
        'North West',
        'Western Cape'
      ]);
    }
    
    const sqlQuery = `
      SELECT DISTINCT province 
      FROM venues 
      WHERE province IS NOT NULL AND province != ''
      UNION
      SELECT DISTINCT province 
      FROM churches 
      WHERE province IS NOT NULL AND province != ''
      ORDER BY province
    `;

    database.all(sqlQuery, [], (err, rows) => {
      if (err) {
        console.error('=== PROVINCES QUERY ERROR ===');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('SQL Query:', sqlQuery);
        console.error('=============================');
        // Return default provinces as fallback
        return res.json([
          'Eastern Cape',
          'Free State',
          'Gauteng',
          'KwaZulu-Natal',
          'Limpopo',
          'Mpumalanga',
          'Northern Cape',
          'North West',
          'Western Cape'
        ]);
      }
      
      const provinces = rows.map(row => row.province).filter(p => p);
      
      // If no provinces found, return default list
      if (provinces.length === 0) {
        return res.json([
          'Eastern Cape',
          'Free State',
          'Gauteng',
          'KwaZulu-Natal',
          'Limpopo',
          'Mpumalanga',
          'Northern Cape',
          'North West',
          'Western Cape'
        ]);
      }
      
      res.json(provinces);
    });
  } catch (error) {
    console.error('Provinces route error:', error);
    // Return default provinces as fallback
    res.json([
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'Northern Cape',
      'North West',
      'Western Cape'
    ]);
  }
});

module.exports = router;

