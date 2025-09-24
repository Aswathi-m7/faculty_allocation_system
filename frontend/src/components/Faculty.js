import React, { useEffect, useState } from 'react';
import { fetchFaculty, addFaculty, updateFaculty, deleteFaculty } from '../services/api';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: '', dept_id: '', max_load: '' });
  const [editingId, setEditingId] = useState(null);

  const loadFaculty = () => { fetchFaculty().then(res => setFaculty(res.data)).catch(err => console.error(err)); };
  useEffect(() => { loadFaculty(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      updateFaculty(editingId, form).then(() => {
        setForm({ name: '', dept_id: '', max_load: '' });
        setEditingId(null);
        loadFaculty();
      });
    } else {
      addFaculty(form).then(() => { setForm({ name: '', dept_id: '', max_load: '' }); loadFaculty(); });
    }
  };

  const handleEdit = f => { setForm({ name: f.name, dept_id: f.dept_id, max_load: f.max_load }); setEditingId(f.faculty_id); };
  const handleDelete = id => { if(window.confirm('Delete this faculty?')) { deleteFaculty(id).then(() => loadFaculty()); } };

  return (
    <div>
      <h3>{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="dept_id" placeholder="Department ID" value={form.dept_id} onChange={handleChange} required />
        <input name="max_load" placeholder="Max Load" value={form.max_load} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {faculty.map(f => (
          <li key={f.faculty_id}>
            {f.name} | Dept: {f.dept_id} | Max Load: {f.max_load}
            <button onClick={() => handleEdit(f)}>Edit</button>
            <button onClick={() => handleDelete(f.faculty_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faculty;
