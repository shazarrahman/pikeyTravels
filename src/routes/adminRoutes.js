const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Admin-only dashboard stats
router.get('/dashboard', auth, admin, getDashboardStats);

module.exports = router;
