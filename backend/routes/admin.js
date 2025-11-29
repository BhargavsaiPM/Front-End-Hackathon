const express = require('express');
const bcrypt = require('bcryptjs');
const { dbGet, dbAll, dbRun } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = ?', ['victim']);
    const totalCounsellors = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = ?', ['counsellor']);
    const totalLegal = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = ?', ['legal']);
    const activeCases = await dbGet('SELECT COUNT(*) as count FROM help_requests WHERE status = ?', ['active']);
    const closedCases = await dbGet('SELECT COUNT(*) as count FROM help_requests WHERE status = ?', ['closed']);
    const pendingCases = await dbGet('SELECT COUNT(*) as count FROM help_requests WHERE status = ?', ['pending']);

    res.json({
      stats: {
        totalUsers: totalUsers.count,
        totalCounsellors: totalCounsellors.count,
        totalLegalAdvisors: totalLegal.count,
        activeCases: activeCases.count,
        closedCases: closedCases.count,
        pendingCases: pendingCases.count
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Create advisor account
router.post('/advisors', async (req, res) => {
  try {
    const { email, password, role, pseudonym } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role required' });
    }

    if (!['counsellor', 'legal'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be counsellor or legal' });
    }

    // Check if email exists
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const anonymousId = role === 'counsellor' ? `COUN-${Date.now()}` : `LEGAL-${Date.now()}`;

    const result = await dbRun(
      `INSERT INTO users (anonymous_id, email, password_hash, role, pseudonym) 
       VALUES (?, ?, ?, ?, ?)`,
      [anonymousId, email, passwordHash, role, pseudonym || null]
    );

    const user = await dbGet(
      'SELECT id, anonymous_id, email, role, pseudonym FROM users WHERE id = ?',
      [result.id]
    );

    // Log action
    await dbRun(
      `INSERT INTO audit_logs (admin_id, action_type, description) 
       VALUES (?, ?, ?)`,
      [req.user.id, 'create_advisor', `Created ${role} account: ${anonymousId}`]
    );

    res.status(201).json({ user });
  } catch (error) {
    console.error('Create advisor error:', error);
    res.status(500).json({ error: 'Failed to create advisor' });
  }
});

// Get all advisors
router.get('/advisors', async (req, res) => {
  try {
    const advisors = await dbAll(
      `SELECT u.id, u.anonymous_id, u.email, u.role, u.pseudonym, u.created_at,
              a.status, a.note
       FROM users u
       LEFT JOIN availability a ON u.id = a.user_id
       WHERE u.role IN ('counsellor', 'legal')
       ORDER BY u.role, u.created_at DESC`
    );

    res.json({ advisors });
  } catch (error) {
    console.error('Get advisors error:', error);
    res.status(500).json({ error: 'Failed to get advisors' });
  }
});

// Update advisor
router.put('/advisors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, pseudonym, role } = req.body;

    const advisor = await dbGet('SELECT * FROM users WHERE id = ? AND role IN (?, ?)', [id, 'counsellor', 'legal']);
    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    if (email) {
      const existing = await dbGet('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    await dbRun(
      `UPDATE users 
       SET email = COALESCE(?, email),
           pseudonym = COALESCE(?, pseudonym),
           role = COALESCE(?, role)
       WHERE id = ?`,
      [email || null, pseudonym || null, role || null, id]
    );

    // Log action
    await dbRun(
      `INSERT INTO audit_logs (admin_id, action_type, description) 
       VALUES (?, ?, ?)`,
      [req.user.id, 'update_advisor', `Updated advisor: ${advisor.anonymous_id}`]
    );

    const updated = await dbGet('SELECT id, anonymous_id, email, role, pseudonym FROM users WHERE id = ?', [id]);
    res.json({ user: updated });
  } catch (error) {
    console.error('Update advisor error:', error);
    res.status(500).json({ error: 'Failed to update advisor' });
  }
});

// Delete advisor
router.delete('/advisors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const advisor = await dbGet('SELECT * FROM users WHERE id = ? AND role IN (?, ?)', [id, 'counsellor', 'legal']);
    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [id]);

    // Log action
    await dbRun(
      `INSERT INTO audit_logs (admin_id, action_type, description) 
       VALUES (?, ?, ?)`,
      [req.user.id, 'delete_advisor', `Deleted advisor: ${advisor.anonymous_id}`]
    );

    res.json({ message: 'Advisor deleted successfully' });
  } catch (error) {
    console.error('Delete advisor error:', error);
    res.status(500).json({ error: 'Failed to delete advisor' });
  }
});

// Reset advisor password
router.post('/advisors/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const advisor = await dbGet('SELECT * FROM users WHERE id = ? AND role IN (?, ?)', [id, 'counsellor', 'legal']);
    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);

    // Log action
    await dbRun(
      `INSERT INTO audit_logs (admin_id, action_type, description) 
       VALUES (?, ?, ?)`,
      [req.user.id, 'reset_password', `Reset password for advisor: ${advisor.anonymous_id}`]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await dbAll(
      `SELECT al.*, u.anonymous_id as admin_anonymous_id
       FROM audit_logs al
       JOIN users u ON al.admin_id = u.id
       ORDER BY al.timestamp DESC
       LIMIT 100`
    );

    res.json({ logs });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
});

module.exports = router;

