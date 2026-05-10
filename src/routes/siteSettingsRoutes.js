const express = require('express');
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings,
  updateBranding,
  updateHero,
  updateSections,
  updateFooter,
  updateNavItems
} = require('../controllers/siteSettingsController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getSiteSettings);
router.put('/', auth, admin, updateSiteSettings);
router.put('/branding', auth, admin, updateBranding);
router.put('/hero', auth, admin, updateHero);
router.put('/sections', auth, admin, updateSections);
router.put('/footer', auth, admin, updateFooter);
router.put('/nav-items', auth, admin, updateNavItems);

module.exports = router;