import axios from './axios';

export const getCurrentUser = () => axios.get('/api/users/me');
export const updateUser = (id, data) => axios.patch(`/api/users/${id}`, data);
export const getUserBookings = () => axios.get('/api/bookings/my');
