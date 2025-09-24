const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all courses
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY course_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new course
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, dept_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO courses (name, dept_id) VALUES ($1, $2) RETURNING *',
      [name, dept_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update course
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, dept_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE courses SET name=$1, dept_id=$2 WHERE course_id=$3 RETURNING *',
      [name, dept_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete course
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE course_id=$1', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
