const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// -----------------------------
// Admin Routes
// -----------------------------

// Get all allocations
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.allocation_id, f.name AS faculty_name, c.name AS class_name, co.name AS course_name
       FROM allocations a
       JOIN faculty f ON a.faculty_id = f.faculty_id
       JOIN classes c ON a.class_id = c.class_id
       JOIN courses co ON c.course_id = co.course_id
       ORDER BY a.allocation_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new allocation
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { faculty_id, class_id } = req.body;
  try {
    // Optional: check if faculty max load exceeded
    const loadCheck = await pool.query(
      'SELECT COUNT(*) AS count FROM allocations WHERE faculty_id=$1',
      [faculty_id]
    );
    const maxLoadRes = await pool.query('SELECT max_load FROM faculty WHERE faculty_id=$1', [faculty_id]);
    const maxLoad = maxLoadRes.rows[0].max_load;

    if (parseInt(loadCheck.rows[0].count) >= maxLoad) {
      return res.status(400).json({ error: 'Faculty max load exceeded' });
    }

    // Optional: check if class is already allocated
    const classCheck = await pool.query('SELECT * FROM allocations WHERE class_id=$1', [class_id]);
    if (classCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Class already allocated' });
    }

    // Insert allocation
    const result = await pool.query(
      'INSERT INTO allocations (faculty_id, class_id) VALUES ($1, $2) RETURNING *',
      [faculty_id, class_id]
    );

    // Update allocation_status
    await pool.query(
      'INSERT INTO allocation_status (message) VALUES ($1)',
      [`Allocation created: Faculty ID ${faculty_id} assigned to Class ID ${class_id}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update allocation
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { faculty_id, class_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE allocations SET faculty_id=$1, class_id=$2 WHERE allocation_id=$3 RETURNING *',
      [faculty_id, class_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete allocation
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM allocations WHERE allocation_id=$1', [req.params.id]);
    await pool.query(
      'INSERT INTO allocation_status (message) VALUES ($1)',
      [`Allocation revoked: Allocation ID ${req.params.id}`]
    );
    res.json({ message: 'Allocation deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get latest allocation status messages (last 10)
router.get('/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT message, created_at FROM allocation_status ORDER BY id DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
