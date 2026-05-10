const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // allow admin or the owner to fetch
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // whitelist allowed fields to prevent mass assignment
    const { name, email, password, phone, avatar } = req.body;
    const userData = { name, email, passwordHash: password || undefined, phone, avatar };
    const user = await User.create(userData);
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.status(201).json({ success: true, data: userObj });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    // only admin or owner can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // whitelist updatable fields
    const { name, email, password, phone, avatar, role } = req.body;
    const updateData = { name, email, phone, avatar };

    // only allow role change if requester is admin
    if (role && req.user.role === 'admin') updateData.role = role;
    if (password) updateData.passwordHash = password;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    // allow owner or admin to delete
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user._id, user.role);
    const { passwordHash, ...userData } = user.toObject();
    res.json({ success: true, data: { user: userData, token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};