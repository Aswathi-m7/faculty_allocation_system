const express = require('express');
const cors = require('cors');
const pool = require('./db/pool'); // adjust path to your pool file
const facultyRoutes = require('./routes/faculty');
const departmentRoutes = require('./routes/departments');
const courseRoutes = require('./routes/courses');
const classRoutes = require('./routes/classes');
const allocationRoutes = require('./routes/allocations');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/faculty', facultyRoutes);
app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);
app.use('/classes', classRoutes);
app.use('/allocations', allocationRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
