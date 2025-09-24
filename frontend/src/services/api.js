import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Your backend URL

// Faculty APIs
export const fetchFaculty = () => axios.get(`${API_URL}/faculty`);
export const addFaculty = (data) => axios.post(`${API_URL}/faculty`, data);
export const updateFaculty = (id, data) => axios.put(`${API_URL}/faculty/${id}`, data);
export const deleteFaculty = (id) => axios.delete(`${API_URL}/faculty/${id}`);

// Departments APIs
export const fetchDepartments = () => axios.get(`${API_URL}/departments`);
export const addDepartment = (data) => axios.post(`${API_URL}/departments`, data);
export const updateDepartment = (id, data) => axios.put(`${API_URL}/departments/${id}`, data);
export const deleteDepartment = (id) => axios.delete(`${API_URL}/departments/${id}`);

// Courses APIs
export const fetchCourses = () => axios.get(`${API_URL}/courses`);
export const addCourse = (data) => axios.post(`${API_URL}/courses`, data);
export const updateCourse = (id, data) => axios.put(`${API_URL}/courses/${id}`, data);
export const deleteCourse = (id) => axios.delete(`${API_URL}/courses/${id}`);

// Classes APIs
export const fetchClasses = () => axios.get(`${API_URL}/classes`);
export const addClass = (data) => axios.post(`${API_URL}/classes`, data);
export const updateClass = (id, data) => axios.put(`${API_URL}/classes/${id}`, data);
export const deleteClass = (id) => axios.delete(`${API_URL}/classes/${id}`);

// Allocations APIs
export const fetchAllocations = () => axios.get(`${API_URL}/allocations`);
export const addAllocation = (data) => axios.post(`${API_URL}/allocations`, data);
export const updateAllocation = (id, data) => axios.put(`${API_URL}/allocations/${id}`, data);
export const deleteAllocation = (id) => axios.delete(`${API_URL}/allocations/${id}`);
