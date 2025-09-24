const express = require('express');
const cors = require('cors');
const morgan = require('morgan');         // Optional logging
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(cors({ origin: 'http://localhost:3001' })); // adjust if your frontend runs elsewhere
app.use(express.json());
app.use(morgan('dev'));                    // Optional: logs requests in console

// ===== Routes =====
const authRoutes = require('./routes/auth');           // ⬅️ New
const facultyRoutes = require('./routes/faculty');
const departmentRoutes = require('./routes/departments');
const courseRoutes = require('./routes/courses');
const classRoutes = require('./routes/classes');
const allocationRoutes = require('./routes/allocations');
const teacherRoutes = require('./routes/teacher');
// Use routes
app.use('/auth', authRoutes);
app.use('/faculty', facultyRoutes);
app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);
app.use('/classes', classRoutes);
app.use('/allocations', allocationRoutes);
app.use('/teacher', teacherRoutes);
// ===== Health Check =====
app.get('/', (req, res) => {
  res.send('✅ Faculty Allocation API is running');
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
