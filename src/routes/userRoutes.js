const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Admin-only: list users
router.get('/', auth, admin, getAllUsers);

// Authenticated: get user (owner or admin enforced in controller)
router.get('/:id', auth, getUserById);

// Public: registration (validate and sanitize)
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  checkValidation,
  createUser
);

// Public: login
router.post('/login', login);

// Authenticated: update user (authorization check done in controller)
router.put('/:id', auth, updateUser);

// Authenticated: delete user (authorization check done in controller)
router.delete('/:id', auth, deleteUser);

module.exports = router;