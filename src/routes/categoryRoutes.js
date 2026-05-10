const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', auth, admin, createCategory);
router.put('/:id', auth, admin, updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

module.exports = router;