const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingsForProvider
} = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllBookings);
router.get('/provider/me', auth, getBookingsForProvider);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/status', auth, admin, updateBookingStatus);
router.delete('/:id', auth, admin, deleteBooking);

module.exports = router;