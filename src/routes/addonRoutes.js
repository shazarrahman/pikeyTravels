const express = require('express');
const router = express.Router();
const {
  getAllAddOns,
  getAllAddOnsAdmin,
  getAddOnById,
  createAddOn,
  updateAddOn,
  toggleShowOnFront,
  deleteAddOn
} = require('../controllers/addonController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllAddOns);
router.get('/admin', auth, admin, getAllAddOnsAdmin);
router.get('/:id', getAddOnById);
router.post('/', auth, admin, createAddOn);
router.put('/:id', auth, admin, updateAddOn);
router.patch('/:id/toggle-front', auth, admin, toggleShowOnFront);
router.delete('/:id', auth, admin, deleteAddOn);

module.exports = router;