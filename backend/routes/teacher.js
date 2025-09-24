const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get allocations for this teacher
router.get('/allocations', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const teacherId = req.user.user_id;
    const result = await pool.query(
      `SELECT a.allocation_id, c.class_id, c.name AS class_name, co.name AS course_name
       FROM allocations a
       JOIN classes c ON a.class_id = c.class_id
       JOIN courses co ON c.course_id = co.course_id
       WHERE a.faculty_id=$1`,
      [teacherId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept allocation
router.post('/allocations/accept/:id', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const allocationId = req.params.id;
    const teacherId = req.user.user_id;

    await pool.query(
      'UPDATE allocations SET status=$1 WHERE allocation_id=$2 AND faculty_id=$3',
      ['accepted', allocationId, teacherId]
    );

    await pool.query(
      'INSERT INTO allocation_status (message) VALUES ($1)',
      [`Teacher ID ${teacherId} accepted Allocation ID ${allocationId}`]
    );

    res.json({ message: 'Allocation accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revoke allocation
router.post('/allocations/revoke/:id', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const allocationId = req.params.id;
    const teacherId = req.user.user_id;

    await pool.query(
      'UPDATE allocations SET status=$1 WHERE allocation_id=$2 AND faculty_id=$3',
      ['revoked', allocationId, teacherId]
    );

    await pool.query(
      'INSERT INTO allocation_status (message) VALUES ($1)',
      [`Teacher ID ${teacherId} revoked Allocation ID ${allocationId}`]
    );

    res.json({ message: 'Allocation revoked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
