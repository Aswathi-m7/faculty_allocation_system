import React, { useEffect, useState } from 'react';
import { fetchClasses, addClass, updateClass, deleteClass } from '../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ course_id: '', semester: '', day_of_week: '', start_time: '', end_time: '', room: '' });
  const [editingId, setEditingId] = useState(null);

  const loadClasses = () => { fetchClasses().then(res => setClasses(res.data)).catch(err => console.error(err)); };
  useEffect(() => { loadClasses(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      updateClass(editingId, form).then(() => { setForm({ course_id: '', semester: '', day_of_week: '', start_time: '', end_time: '', room: '' }); setEditingId(null); loadClasses(); });
    } else {
      addClass(form).then(() => { setForm({ course_id: '', semester: '', day_of_week: '', start_time: '', end_time: '', room: '' }); loadClasses(); });
    }
  };

  const handleEdit = c => { setForm({ course_id: c.course_id, semester: c.semester, day_of_week: c.day_of_week, start_time: c.start_time, end_time: c.end_time, room: c.room }); setEditingId(c.class_id); };
  const handleDelete = id => { if(window.confirm('Delete this class?')) { deleteClass(id).then(() => loadClasses()); } };

  return (
    <div>
      <h3>{editingId ? 'Edit Class' : 'Add Class'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input name="course_id" placeholder="Course ID" value={form.course_id} onChange={handleChange} required />
        <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required />
        <input name="day_of_week" placeholder="Day of Week" value={form.day_of_week} onChange={handleChange} required />
        <input name="start_time" placeholder="Start Time" value={form.start_time} onChange={handleChange} required />
        <input name="end_time" placeholder="End Time" value={form.end_time} onChange={handleChange} required />
        <input name="room" placeholder="Room" value={form.room} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {classes.map(c => (
          <li key={c.class_id}>
            Course ID: {c.course_id} | Semester: {c.semester} | {c.day_of_week} {c.start_time}-{c.end_time} | Room: {c.room}
            <button onClick={() => handleEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.class_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Classes;
