import axios from './axios';

export const getAddOns = () => axios.get('/api/addons');
export const getAddOnsAdmin = () => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.get('/api/addons/admin', { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const getAddOnById = (id) => axios.get(`/api/addons/${id}`);
export const createAddOn = (data) => axios.post('/api/addons', data);
export const updateAddOn = (id, data) => axios.put(`/api/addons/${id}`, data);
export const deleteAddOn = (id) => axios.delete(`/api/addons/${id}`);