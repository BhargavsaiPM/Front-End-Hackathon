const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate anonymous ID
const generateAnonymousId = async (role) => {
  const prefix = role === 'victim' ? 'VIC' : role === 'counsellor' ? 'COUN' : role === 'legal' ? 'LEGAL' : 'ADMIN';
  const count = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = ?', [role]);
  const num = (count.count || 0) + 1;
  return `${prefix}-${String(num).padStart(4, '0')}`;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, pseudonym, gender, role = 'victim' } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    if (email) {
      const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const anonymousId = await generateAnonymousId(role);

    const result = await dbRun(
      `INSERT INTO users (anonymous_id, pseudonym, email, password_hash, role, gender) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [anonymousId, pseudonym || null, email || null, passwordHash, role, gender || null]
    );

    const token = jwt.sign(
      { userId: result.id, role, anonymousId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: result.id,
        anonymousId,
        pseudonym,
        role,
        gender
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await dbGet(
      'SELECT id, anonymous_id, pseudonym, email, password_hash, role, gender FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, anonymousId: user.anonymous_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        anonymousId: user.anonymous_id,
        pseudonym: user.pseudonym,
        role: user.role,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, anonymous_id, pseudonym, email, role, gender, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;

