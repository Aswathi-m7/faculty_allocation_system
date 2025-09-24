import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const StudentDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fetch allocations assigned to the student
  const fetchAllocations = async () => {
    try {
      const res = await axios.get(`${API_URL}/allocations/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllocations(res.data);
      if (res.data.length === 0) {
        setStatusMessage('No allocations assigned yet.');
      } else {
        setStatusMessage('');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to fetch allocations');
    }
  };

  useEffect(() => {
    if (token && role === 'student') fetchAllocations();
  }, [token, role]);

  if (role !== 'student') return <p style={{ textAlign: 'center' }}>Access denied. Only students can view this page.</p>;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Student Dashboard</h1>

      {statusMessage && (
        <p style={{ color: allocations.length === 0 ? 'red' : 'green', fontWeight: 'bold' }}>
          {statusMessage}
        </p>
      )}

      {allocations.length > 0 && (
        <table border="1" cellPadding="8" style={{ margin: 'auto', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Class</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => (
              <tr key={alloc.allocation_id}>
                <td>{alloc.class_name}</td>
                <td>{alloc.course_name}</td>
                <td>{alloc.teacher_name}</td>
                <td>{alloc.schedule_time || 'TBD'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
