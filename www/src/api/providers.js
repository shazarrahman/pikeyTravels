import axios from './axios';

export const getProviders = (params) => axios.get('/api/providers', { params });
export const getProvidersAdmin = (params) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.get('/api/providers/admin', { params, headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const checkProviderByEmail = (email) => {
	// Add a timestamp to avoid cached 304 responses from browsers or proxies
	const params = { email, _t: Date.now() };
	return axios.get('/api/providers/check', { params });
};
export const getProviderById = (id) => axios.get(`/api/providers/${id}`);
export const createProvider = (data) => {
	const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
	if (isForm) {
		return axios.post('/api/providers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
	}
	return axios.post('/api/providers', data);
};
export const updateProvider = (id, data, adminToken) => axios.put(`/api/providers/${id}`, data, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
export const approveProvider = (id) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.patch(`/api/providers/${id}/approve`, null, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const rejectProvider = (id) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.patch('/api/providers/' + id + '/reject', null, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const toggleProviderShowOnFront = (id) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.patch(`/api/providers/${id}/toggle-front`, null, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const toggleProviderVisibility = (id, show) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.patch(`/api/providers/${id}/toggle-front`, { showOnFront: show }, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const deleteProvider = (id) => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.delete(`/api/providers/${id}`, { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const loginProvider = (credentials) => axios.post('/api/providers/login', credentials);