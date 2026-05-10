const express = require('express');
const router = express.Router();
const {
  getAllProviders,
  getAllProvidersAdmin,
  getProviderById,
  checkProviderByEmail,
  createProvider,
  updateProvider,
  approveProvider,
  rejectProvider,
  toggleShowOnFront,
  deleteProvider,
  providerLogin
} = require('../controllers/providerController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllProviders);
router.get('/admin', auth, admin, getAllProvidersAdmin);
router.get('/check', checkProviderByEmail);
router.get('/:id', getProviderById);
// Accept multipart form data for provider registration (images + idProof)
router.post('/', upload('providers').fields([
  { name: 'images', maxCount: 10 },
  { name: 'idProofUrl', maxCount: 1 }
]), createProvider);
router.post('/login', providerLogin);
router.put('/:id', auth, admin, updateProvider);
router.patch('/:id/approve', auth, admin, approveProvider);
router.patch('/:id/reject', auth, admin, rejectProvider);
router.patch('/:id/toggle-front', auth, admin, toggleShowOnFront);
router.delete('/:id', auth, admin, deleteProvider);

module.exports = router;