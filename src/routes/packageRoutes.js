const express = require('express');
const router = express.Router();
const {
  getAllPackages,
  getAllPackagesAdmin,
  getFeaturedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllPackages);
router.get('/admin', auth, admin, getAllPackagesAdmin);
router.get('/featured', getFeaturedPackages);
router.get('/:id', getPackageById);
router.post('/', auth, admin, createPackage);
router.put('/:id', auth, admin, updatePackage);
router.delete('/:id', auth, admin, deletePackage);

module.exports = router;