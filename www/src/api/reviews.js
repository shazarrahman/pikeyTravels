import axios from './axios';

export const getReviews = () => axios.get('/api/reviews');
export const getReviewsAdmin = () => {
	const adminToken = localStorage.getItem('pikey_token');
	return axios.get('/api/reviews/admin', { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
};
export const getReviewById = (id) => axios.get(`/api/reviews/${id}`);
export const createReview = (data) => axios.post('/api/reviews', data);
export const approveReview = (id) => axios.patch(`/api/reviews/${id}/approve`);
export const rejectReview = (id) => axios.patch(`/api/reviews/${id}/reject`);
export const toggleReviewVisibility = (id) => axios.patch(`/api/reviews/${id}/toggle-front`);
export const deleteReview = (id) => axios.delete(`/api/reviews/${id}`);