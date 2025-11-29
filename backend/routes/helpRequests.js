const express = require('express');
const { dbGet, dbAll, dbRun } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create help request (victim only)
router.post('/', authenticateToken, requireRole('victim'), async (req, res) => {
  try {
    const { type, abuse_type, description, since_when, preferred_contact_mode } = req.body;

    if (!type || !['counselling', 'legal'].includes(type)) {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    const result = await dbRun(
      `INSERT INTO help_requests 
       (user_id, type, abuse_type, description, since_when, preferred_contact_mode) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, type, abuse_type || null, description || null, since_when || null, preferred_contact_mode || 'chat']
    );

    const request = await dbGet('SELECT * FROM help_requests WHERE id = ?', [result.id]);

    res.status(201).json({ request });
  } catch (error) {
    console.error('Create help request error:', error);
    res.status(500).json({ error: 'Failed to create help request' });
  }
});

// Get user's own help requests (victim)
router.get('/my-requests', authenticateToken, requireRole('victim'), async (req, res) => {
  try {
    const requests = await dbAll(
      `SELECT hr.*, 
              u.anonymous_id as advisor_anonymous_id, 
              u.pseudonym as advisor_pseudonym
       FROM help_requests hr
       LEFT JOIN users u ON hr.assigned_to = u.id
       WHERE hr.user_id = ?
       ORDER BY hr.created_at DESC`,
      [req.user.id]
    );

    res.json({ requests });
  } catch (error) {
    console.error('Get help requests error:', error);
    res.status(500).json({ error: 'Failed to get help requests' });
  }
});

// Get help requests for counsellor
router.get('/counselling', authenticateToken, requireRole('counsellor'), async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `SELECT hr.*, 
                        u.anonymous_id, 
                        u.pseudonym,
                        u.gender
                 FROM help_requests hr
                 JOIN users u ON hr.user_id = u.id
                 WHERE hr.type = 'counselling'`;
    
    const params = [];
    if (status) {
      query += ' AND hr.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY hr.created_at DESC';
    
    const requests = await dbAll(query, params);

    // Remove any personal identifiers
    const anonymized = requests.map(req => ({
      ...req,
      // Only include anonymous_id and pseudonym, no email or other identifiers
    }));

    res.json({ requests: anonymized });
  } catch (error) {
    console.error('Get counselling requests error:', error);
    res.status(500).json({ error: 'Failed to get counselling requests' });
  }
});

// Get help requests for legal advisor
router.get('/legal', authenticateToken, requireRole('legal'), async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `SELECT hr.*, 
                        u.anonymous_id, 
                        u.pseudonym,
                        u.gender
                 FROM help_requests hr
                 JOIN users u ON hr.user_id = u.id
                 WHERE hr.type = 'legal'`;
    
    const params = [];
    if (status) {
      query += ' AND hr.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY hr.created_at DESC';
    
    const requests = await dbAll(query, params);

    res.json({ requests });
  } catch (error) {
    console.error('Get legal requests error:', error);
    res.status(500).json({ error: 'Failed to get legal requests' });
  }
});

// Assign advisor to request (counsellor/legal)
router.patch('/:id/assign', authenticateToken, requireRole('counsellor', 'legal'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await dbGet('SELECT * FROM help_requests WHERE id = ?', [id]);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Verify the request type matches the advisor role
    const expectedType = req.user.role === 'counsellor' ? 'counselling' : 'legal';
    if (request.type !== expectedType) {
      return res.status(403).json({ error: 'Request type does not match your role' });
    }

    await dbRun(
      `UPDATE help_requests 
       SET assigned_to = ?, status = 'active', updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [req.user.id, id]
    );

    const updated = await dbGet('SELECT * FROM help_requests WHERE id = ?', [id]);
    res.json({ request: updated });
  } catch (error) {
    console.error('Assign request error:', error);
    res.status(500).json({ error: 'Failed to assign request' });
  }
});

// Update request status
router.patch('/:id/status', authenticateToken, requireRole('counsellor', 'legal'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = await dbGet('SELECT * FROM help_requests WHERE id = ?', [id]);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Verify advisor has access
    if (request.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await dbRun(
      `UPDATE help_requests 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, id]
    );

    const updated = await dbGet('SELECT * FROM help_requests WHERE id = ?', [id]);
    res.json({ request: updated });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;

