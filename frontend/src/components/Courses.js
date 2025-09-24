import React, { useEffect, useState } from 'react';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course_name: '', credits: '', dept_id: '' });
  const [editingId, setEditingId] = useState(null);

  const loadCourses = () => { fetchCourses().then(res => setCourses(res.data)).catch(err => console.error(err)); };
  useEffect(() => { loadCourses(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      updateCourse(editingId, form).then(() => { setForm({ course_name: '', credits: '', dept_id: '' }); setEditingId(null); loadCourses(); });
    } else {
      addCourse(form).then(() => { setForm({ course_name: '', credits: '', dept_id: '' }); loadCourses(); });
    }
  };

  const handleEdit = c => { setForm({ course_name: c.course_name, credits: c.credits, dept_id: c.dept_id }); setEditingId(c.course_id); };
  const handleDelete = id => { if(window.confirm('Delete this course?')) { deleteCourse(id).then(() => loadCourses()); } };

  return (
    <div>
      <h3>{editingId ? 'Edit Course' : 'Add Course'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input name="course_name" placeholder="Course Name" value={form.course_name} onChange={handleChange} required />
        <input name="credits" placeholder="Credits" value={form.credits} onChange={handleChange} required />
        <input name="dept_id" placeholder="Department ID" value={form.dept_id} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {courses.map(c => (
          <li key={c.course_id}>
            {c.course_name} | Credits: {c.credits} | Dept: {c.dept_id}
            <button onClick={() => handleEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.course_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
