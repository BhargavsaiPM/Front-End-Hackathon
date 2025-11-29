const express = require('express');
const { dbGet, dbRun, dbAll } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get availability (public for advisors)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query; // 'counsellor' or 'legal'
    
    let query = `SELECT u.id, u.anonymous_id, u.pseudonym, u.role, 
                        a.status, a.note, a.time_window
                 FROM users u
                 LEFT JOIN availability a ON u.id = a.user_id
                 WHERE u.role IN ('counsellor', 'legal')`;
    
    const params = [];
    if (type && (type === 'counsellor' || type === 'legal')) {
      query += ' AND u.role = ?';
      params.push(type);
    }
    
    const advisors = await dbAll(query, params);
    res.json({ advisors });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
});

// Update own availability (counsellor/legal only)
router.put('/me', authenticateToken, requireRole('counsellor', 'legal'), async (req, res) => {
  try {
    const { status, note, time_window } = req.body;

    if (status && !['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if availability record exists
    const existing = await dbGet('SELECT id FROM availability WHERE user_id = ?', [req.user.id]);

    if (existing) {
      await dbRun(
        `UPDATE availability 
         SET status = COALESCE(?, status), 
             note = COALESCE(?, note), 
             time_window = COALESCE(?, time_window),
             updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ?`,
        [status || null, note || null, time_window || null, req.user.id]
      );
    } else {
      await dbRun(
        `INSERT INTO availability (user_id, status, note, time_window) 
         VALUES (?, ?, ?, ?)`,
        [req.user.id, status || 'offline', note || null, time_window || null]
      );
    }

    const updated = await dbGet(
      `SELECT a.*, u.anonymous_id, u.pseudonym, u.role 
       FROM availability a
       JOIN users u ON a.user_id = u.id
       WHERE a.user_id = ?`,
      [req.user.id]
    );

    res.json({ availability: updated });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

module.exports = router;

