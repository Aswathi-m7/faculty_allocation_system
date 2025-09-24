const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all classes
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes ORDER BY class_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new class
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, course_id, schedule_time } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO classes (name, course_id, schedule_time) VALUES ($1, $2, $3) RETURNING *',
      [name, course_id, schedule_time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update class
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, course_id, schedule_time } = req.body;
  try {
    const result = await pool.query(
      'UPDATE classes SET name=$1, course_id=$2, schedule_time=$3 WHERE class_id=$4 RETURNING *',
      [name, course_id, schedule_time, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete class
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM classes WHERE class_id=$1', [req.params.id]);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
