import axios from './axios';

export const getDestinations = () => axios.get('/api/destinations');
export const getDestinationsAdmin = () => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.get('/api/destinations/admin', { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const getDestinationById = (id) => axios.get(`/api/destinations/${id}`);
export const createDestination = (data) => axios.post('/api/destinations', data);
export const updateDestination = (id, data) => axios.put(`/api/destinations/${id}`, data);
export const deleteDestination = (id) => axios.delete(`/api/destinations/${id}`);
