const express = require('express');
const { dbGet, dbAll } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user profile (own profile only for victims, anonymized for others)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, anonymous_id, pseudonym, role, gender, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get anonymized user list (admin only)
router.get('/anonymized', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await dbAll(
      `SELECT id, anonymous_id, pseudonym, role, gender, created_at 
       FROM users 
       WHERE role = 'victim'
       ORDER BY created_at DESC`
    );

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get advisors (counsellors and legal advisors)
router.get('/advisors', authenticateToken, async (req, res) => {
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
    
    query += ' ORDER BY u.role, u.id';
    
    const advisors = await dbAll(query, params);
    res.json({ advisors });
  } catch (error) {
    console.error('Get advisors error:', error);
    res.status(500).json({ error: 'Failed to get advisors' });
  }
});

module.exports = router;

