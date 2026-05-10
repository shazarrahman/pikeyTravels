const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getAllDestinationsAdmin,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllDestinations);
router.get('/admin', auth, admin, getAllDestinationsAdmin);
router.get('/:id', getDestinationById);
router.post('/', auth, admin, createDestination);
router.put('/:id', auth, admin, updateDestination);
router.delete('/:id', auth, admin, deleteDestination);

module.exports = router;