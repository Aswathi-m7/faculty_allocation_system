import React, { useEffect, useState } from 'react';
import { fetchDepartments, addDepartment, updateDepartment, deleteDepartment } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ dept_name: '', hod_name: '' });
  const [editingId, setEditingId] = useState(null);

  const loadDepartments = () => { fetchDepartments().then(res => setDepartments(res.data)).catch(err => console.error(err)); };
  useEffect(() => { loadDepartments(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      updateDepartment(editingId, form).then(() => { setForm({ dept_name: '', hod_name: '' }); setEditingId(null); loadDepartments(); });
    } else {
      addDepartment(form).then(() => { setForm({ dept_name: '', hod_name: '' }); loadDepartments(); });
    }
  };

  const handleEdit = d => { setForm({ dept_name: d.dept_name, hod_name: d.hod_name }); setEditingId(d.dept_id); };
  const handleDelete = id => { if(window.confirm('Delete this department?')) { deleteDepartment(id).then(() => loadDepartments()); } };

  return (
    <div>
      <h3>{editingId ? 'Edit Department' : 'Add Department'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input name="dept_name" placeholder="Department Name" value={form.dept_name} onChange={handleChange} required />
        <input name="hod_name" placeholder="HOD Name" value={form.hod_name} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {departments.map(d => (
          <li key={d.dept_id}>
            {d.dept_name} | HOD: {d.hod_name}
            <button onClick={() => handleEdit(d)}>Edit</button>
            <button onClick={() => handleDelete(d.dept_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Departments;
