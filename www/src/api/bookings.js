import axios from './axios';

export const getBookings = () => axios.get('/api/bookings');
export const getBookingById = (id) => axios.get(`/api/bookings/${id}`);
export const createBooking = (data) => axios.post('/api/bookings', data);
export const updateBookingStatus = (id, data) => axios.patch(`/api/bookings/${id}/status`, data);
export const deleteBooking = (id) => axios.delete(`/api/bookings/${id}`);
export const getProviderBookings = () => axios.get('/api/bookings/provider/me');
