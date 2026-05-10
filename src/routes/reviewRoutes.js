const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getAllReviewsAdmin,
  getReviewById,
  createReview,
  approveReview,
  rejectReview,
  toggleShowOnFront,
  deleteReview
} = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllReviews);
router.get('/admin', auth, admin, getAllReviewsAdmin);
router.get('/:id', getReviewById);
router.post('/', createReview);
router.patch('/:id/approve', auth, admin, approveReview);
router.patch('/:id/reject', auth, admin, rejectReview);
router.patch('/:id/toggle-front', auth, admin, toggleShowOnFront);
router.delete('/:id', auth, admin, deleteReview);

module.exports = router;