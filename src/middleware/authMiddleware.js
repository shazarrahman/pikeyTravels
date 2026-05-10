const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support tokens issued for both regular users and providers
    if (decoded && decoded.role === 'provider') {
      const Provider = require('../models/Provider');
      const provider = await Provider.findById(decoded.id).select('-password');
      if (!provider) {
        return res.status(401).json({ success: false, message: 'Provider not found' });
      }
      // normalize to req.user with role so downstream middleware works
      req.user = provider.toObject ? { ...provider.toObject(), role: 'provider' } : provider;
      return next();
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = auth;
