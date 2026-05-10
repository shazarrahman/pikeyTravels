import axios from './axios';

export const getCategories = (type) => axios.get(`/api/categories${type ? `?type=${type}` : ''}`);
export const getCategoryById = (id) => axios.get(`/api/categories/${id}`);
export const createCategory = (data) => axios.post('/api/categories', data);
export const updateCategory = (id, data) => axios.put(`/api/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`/api/categories/${id}`);
