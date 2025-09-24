import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');

  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [statusMessages, setStatusMessages] = useState([]);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(null); // {type:'faculty',id:..}

  // Forms
  const [facultyForm, setFacultyForm] = useState({ name: '', dept_id: '', max_load: '' });
  const [departmentForm, setDepartmentForm] = useState({ name: '' });
  const [courseForm, setCourseForm] = useState({ name: '', dept_id: '' });
  const [classForm, setClassForm] = useState({ name: '', course_id: '' });
  const [allocationForm, setAllocationForm] = useState({ faculty_id: '', class_id: '' });

  // Fetch everything
  const fetchData = async () => {
    try {
      const [f, d, c, cl, a, s] = await Promise.all([
        axios.get(`${API_URL}/faculty`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/departments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/classes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/allocations`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/allocations/status`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setFacultyList(f.data);
      setDepartments(d.data);
      setCourses(c.data);
      setClasses(cl.data);
      setAllocations(a.data);
      setStatusMessages(s.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch data');
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Generic Delete
  const handleDelete = async (url, id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API_URL}/${url}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  // Generic Submit (Add/Update)
  const handleSubmit = async (url, formData, resetForm) => {
    try {
      if (edit?.type === url) {
        await axios.put(`${API_URL}/${url}/${edit.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        setEdit(null);
      } else {
        await axios.post(`${API_URL}/${url}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  // Start editing
  const startEdit = (type, item) => {
    setEdit({ type, id: item[`${type}_id`] || item.allocation_id });
    switch (type) {
      case 'faculty':
        setFacultyForm({ name: item.name, dept_id: item.dept_id, max_load: item.max_load });
        break;
      case 'departments':
        setDepartmentForm({ name: item.name });
        break;
      case 'courses':
        setCourseForm({ name: item.name, dept_id: item.dept_id });
        break;
      case 'classes':
        setClassForm({ name: item.name, course_id: item.course_id });
        break;
      case 'allocations':
        setAllocationForm({ faculty_id: item.faculty_id, class_id: item.class_id });
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* FACULTY */}
      <h2>Faculty</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('faculty', facultyForm, () =>
            setFacultyForm({ name: '', dept_id: '', max_load: '' })
          );
        }}
      >
        <input placeholder="Name" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required />
        <input placeholder="Dept ID" value={facultyForm.dept_id} onChange={(e) => setFacultyForm({ ...facultyForm, dept_id: e.target.value })} required />
        <input placeholder="Max Load" value={facultyForm.max_load} onChange={(e) => setFacultyForm({ ...facultyForm, max_load: e.target.value })} required />
        <button type="submit">{edit?.type === 'faculty' ? 'Update' : 'Add'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Max Load</th><th>Actions</th></tr></thead>
        <tbody>
          {facultyList.map(f => (
            <tr key={f.faculty_id}>
              <td>{f.faculty_id}</td><td>{f.name}</td><td>{f.dept_id}</td><td>{f.max_load}</td>
              <td>
                <button onClick={() => startEdit('faculty', f)}>Edit</button>
                <button onClick={() => handleDelete('faculty', f.faculty_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DEPARTMENTS */}
      <h2>Departments</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('departments', departmentForm, () => setDepartmentForm({ name: '' }));
        }}
      >
        <input placeholder="Name" value={departmentForm.name} onChange={(e) => setDepartmentForm({ name: e.target.value })} required />
        <button type="submit">{edit?.type === 'departments' ? 'Update' : 'Add'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.dept_id}>
              <td>{d.dept_id}</td><td>{d.name}</td>
              <td>
                <button onClick={() => startEdit('departments', d)}>Edit</button>
                <button onClick={() => handleDelete('departments', d.dept_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* COURSES */}
      <h2>Courses</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('courses', courseForm, () => setCourseForm({ name: '', dept_id: '' }));
        }}
      >
        <input placeholder="Name" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} required />
        <input placeholder="Dept ID" value={courseForm.dept_id} onChange={(e) => setCourseForm({ ...courseForm, dept_id: e.target.value })} required />
        <button type="submit">{edit?.type === 'courses' ? 'Update' : 'Add'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Dept ID</th><th>Actions</th></tr></thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.course_id}>
              <td>{c.course_id}</td><td>{c.name}</td><td>{c.dept_id}</td>
              <td>
                <button onClick={() => startEdit('courses', c)}>Edit</button>
                <button onClick={() => handleDelete('courses', c.course_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CLASSES */}
      <h2>Classes</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('classes', classForm, () => setClassForm({ name: '', course_id: '' }));
        }}
      >
        <input placeholder="Name" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} required />
        <input placeholder="Course ID" value={classForm.course_id} onChange={(e) => setClassForm({ ...classForm, course_id: e.target.value })} required />
        <button type="submit">{edit?.type === 'classes' ? 'Update' : 'Add'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Course ID</th><th>Actions</th></tr></thead>
        <tbody>
          {classes.map(cl => (
            <tr key={cl.class_id}>
              <td>{cl.class_id}</td><td>{cl.name}</td><td>{cl.course_id}</td>
              <td>
                <button onClick={() => startEdit('classes', cl)}>Edit</button>
                <button onClick={() => handleDelete('classes', cl.class_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ALLOCATIONS */}
      <h2>Allocations</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('allocations', allocationForm, () => setAllocationForm({ faculty_id: '', class_id: '' }));
        }}
      >
        <input placeholder="Faculty ID" value={allocationForm.faculty_id} onChange={(e) => setAllocationForm({ ...allocationForm, faculty_id: e.target.value })} required />
        <input placeholder="Class ID" value={allocationForm.class_id} onChange={(e) => setAllocationForm({ ...allocationForm, class_id: e.target.value })} required />
        <button type="submit">{edit?.type === 'allocations' ? 'Update' : 'Add'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Faculty</th><th>Class</th><th>Course</th><th>Actions</th></tr></thead>
        <tbody>
          {allocations.map(a => (
            <tr key={a.allocation_id}>
              <td>{a.allocation_id}</td><td>{a.faculty_name}</td><td>{a.class_name}</td><td>{a.course_name}</td>
              <td>
                <button onClick={() => startEdit('allocations', a)}>Edit</button>
                <button onClick={() => handleDelete('allocations', a.allocation_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* STATUS */}
      <h2>Allocation Status</h2>
      <ul>
        {statusMessages.map((msg, idx) => (
          <li key={idx}>
            {msg.message} ({new Date(msg.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
