const express = require('express');
const { dbGet, dbAll, dbRun } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get messages for a help request
router.get('/help-request/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify user has access to this request
    const request = await dbGet('SELECT * FROM help_requests WHERE id = ?', [requestId]);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check access: user must be the requester, assigned advisor, or admin
    if (request.user_id !== req.user.id && 
        request.assigned_to !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await dbAll(
      `SELECT m.*, 
              u.anonymous_id, 
              u.pseudonym,
              u.role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.help_request_id = ?
       ORDER BY m.timestamp ASC`,
      [requestId]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { help_request_id, content } = req.body;

    if (!help_request_id || !content) {
      return res.status(400).json({ error: 'Help request ID and content required' });
    }

    // Verify user has access to this request
    const request = await dbGet('SELECT * FROM help_requests WHERE id = ?', [help_request_id]);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check access
    if (request.user_id !== req.user.id && 
        request.assigned_to !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await dbRun(
      `INSERT INTO messages (help_request_id, sender_id, sender_role, content) 
       VALUES (?, ?, ?, ?)`,
      [help_request_id, req.user.id, req.user.role, content]
    );

    const message = await dbGet(
      `SELECT m.*, 
              u.anonymous_id, 
              u.pseudonym,
              u.role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [result.id]
    );

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all conversations for a user (victim sees their requests, advisors see assigned requests)
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.role === 'victim') {
      query = `SELECT DISTINCT hr.id as help_request_id, 
                      hr.type,
                      hr.status,
                      hr.created_at,
                      u.anonymous_id as advisor_anonymous_id,
                      u.pseudonym as advisor_pseudonym,
                      u.role as advisor_role,
                      (SELECT COUNT(*) FROM messages m WHERE m.help_request_id = hr.id) as message_count
               FROM help_requests hr
               LEFT JOIN users u ON hr.assigned_to = u.id
               WHERE hr.user_id = ?
               ORDER BY hr.created_at DESC`;
      params = [req.user.id];
    } else if (req.user.role === 'counsellor' || req.user.role === 'legal') {
      const requestType = req.user.role === 'counsellor' ? 'counselling' : 'legal';
      query = `SELECT DISTINCT hr.id as help_request_id, 
                      hr.type,
                      hr.status,
                      hr.created_at,
                      u.anonymous_id,
                      u.pseudonym,
                      u.role,
                      (SELECT COUNT(*) FROM messages m WHERE m.help_request_id = hr.id) as message_count
               FROM help_requests hr
               JOIN users u ON hr.user_id = u.id
               WHERE hr.type = ? AND hr.assigned_to = ?
               ORDER BY hr.created_at DESC`;
      params = [requestType, req.user.id];
    } else {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const conversations = await dbAll(query, params);
    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

module.exports = router;

