import axios from './axios';

export const getPackages = (params) => axios.get('/api/packages', { params });
// Admin endpoint returns all packages (visible + hidden) and requires an admin token
export const getPackagesAdmin = (params) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.get('/api/packages/admin', { params, headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const getFeaturedPackages = () => axios.get('/api/packages/featured');
export const getPackageById = (id) => axios.get(`/api/packages/${id}`);
export const createPackage = (data) => axios.post('/api/packages', data);
export const updatePackage = (id, data) => axios.put(`/api/packages/${id}`, data);
export const deletePackage = (id) => axios.delete(`/api/packages/${id}`);
