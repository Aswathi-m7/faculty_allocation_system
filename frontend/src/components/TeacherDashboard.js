import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const TeacherDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fetch allocations assigned to the teacher
  const fetchAllocations = async () => {
    try {
      const res = await axios.get(`${API_URL}/allocations/teacher/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to fetch allocations');
    }
  };

  useEffect(() => {
    if (token && role === 'teacher') fetchAllocations();
  }, [token, role]);

  // Accept allocation
  const handleAccept = async (allocationId) => {
    try {
      await axios.put(
        `${API_URL}/allocations/teacher/accept/${allocationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage(`Allocation ID ${allocationId} accepted successfully`);
      fetchAllocations();
    } catch (err) {
      console.error(err);
      setStatusMessage(`Failed to accept allocation ID ${allocationId}`);
    }
  };

  // Revoke allocation
  const handleRevoke = async (allocationId) => {
    try {
      await axios.delete(`${API_URL}/allocations/teacher/revoke/${allocationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMessage(`Allocation ID ${allocationId} revoked successfully`);
      fetchAllocations();
    } catch (err) {
      console.error(err);
      setStatusMessage(`Failed to revoke allocation ID ${allocationId}`);
    }
  };

  if (role !== 'teacher') return <p style={{ textAlign: 'center' }}>Access denied. Only teachers can view this page.</p>;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Teacher Dashboard</h1>

      {statusMessage && <p style={{ color: 'green', marginTop: '10px' }}>{statusMessage}</p>}

      {allocations.length === 0 ? (
        <p>No allocations assigned yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ margin: 'auto', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Allocation ID</th>
              <th>Class</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => (
              <tr key={alloc.allocation_id}>
                <td>{alloc.allocation_id}</td>
                <td>{alloc.class_name}</td>
                <td>{alloc.course_name}</td>
                <td>{alloc.status || 'Pending'}</td>
                <td>
                  {alloc.status !== 'Accepted' && (
                    <button onClick={() => handleAccept(alloc.allocation_id)}>Accept</button>
                  )}
                  <button
                    onClick={() => handleRevoke(alloc.allocation_id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherDashboard;
