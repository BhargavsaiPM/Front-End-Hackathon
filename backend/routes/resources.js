const express = require('express');
const { dbGet, dbAll, dbRun } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all resources (public for authenticated users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, category } = req.query;
    
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const resources = await dbAll(query, params);
    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get single resource
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await dbGet('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Create resource (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { title, type, description, link_or_number, category } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type required' });
    }

    const result = await dbRun(
      `INSERT INTO resources (title, type, description, link_or_number, category, created_by_admin_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, type, description || null, link_or_number || null, category || null, req.user.id]
    );

    const resource = await dbGet('SELECT * FROM resources WHERE id = ?', [result.id]);
    res.status(201).json({ resource });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update resource (admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, link_or_number, category } = req.body;

    const resource = await dbGet('SELECT * FROM resources WHERE id = ?', [id]);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await dbRun(
      `UPDATE resources 
       SET title = COALESCE(?, title),
           type = COALESCE(?, type),
           description = COALESCE(?, description),
           link_or_number = COALESCE(?, link_or_number),
           category = COALESCE(?, category)
       WHERE id = ?`,
      [title || null, type || null, description || null, link_or_number || null, category || null, id]
    );

    const updated = await dbGet('SELECT * FROM resources WHERE id = ?', [id]);
    res.json({ resource: updated });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete resource (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await dbGet('SELECT * FROM resources WHERE id = ?', [id]);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await dbRun('DELETE FROM resources WHERE id = ?', [id]);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;

