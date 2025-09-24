const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all faculty (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculty');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new faculty
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, dept_id, max_load } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO faculty (name, dept_id, max_load) VALUES ($1, $2, $3) RETURNING *',
      [name, dept_id, max_load]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update faculty
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, dept_id, max_load } = req.body;
  try {
    const result = await pool.query(
      'UPDATE faculty SET name=$1, dept_id=$2, max_load=$3 WHERE faculty_id=$4 RETURNING *',
      [name, dept_id, max_load, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete faculty
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM faculty WHERE faculty_id=$1', [req.params.id]);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
