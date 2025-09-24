import React, { useEffect, useState } from 'react';
import { fetchAllocations, addAllocation, updateAllocation, deleteAllocation } from '../services/api';

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [form, setForm] = useState({ faculty_id: '', class_id: '' });
  const [editingId, setEditingId] = useState(null);

  const loadAllocations = () => { fetchAllocations().then(res => setAllocations(res.data)).catch(err => console.error(err)); };
  useEffect(() => { loadAllocations(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      updateAllocation(editingId, form).then(() => { setForm({ faculty_id: '', class_id: '' }); setEditingId(null); loadAllocations(); });
    } else {
      addAllocation(form).then(() => { setForm({ faculty_id: '', class_id: '' }); loadAllocations(); });
    }
  };

  const handleEdit = a => { setForm({ faculty_id: a.faculty_id, class_id: a.class_id }); setEditingId(a.allocation_id); };
  const handleDelete = id => { if(window.confirm('Delete this allocation?')) { deleteAllocation(id).then(() => loadAllocations()); } };

  return (
    <div>
      <h3>{editingId ? 'Edit Allocation' : 'Add Allocation'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input name="faculty_id" placeholder="Faculty ID" value={form.faculty_id} onChange={handleChange} required />
        <input name="class_id" placeholder="Class ID" value={form.class_id} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {allocations.map(a => (
          <li key={a.allocation_id}>
            Faculty ID: {a.faculty_id} | Class ID: {a.class_id}
            <button onClick={() => handleEdit(a)}>Edit</button>
            <button onClick={() => handleDelete(a.allocation_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Allocations;
