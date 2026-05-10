const Destination = require('../models/Destination');

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    console.error('getAllDestinations error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getAllDestinationsAdmin = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    console.error('getAllDestinationsAdmin error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    console.error('getDestinationById error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    console.error('createDestination error:', err && err.stack ? err.stack : err);
    // Handle duplicate slug error (unique index)
    if (err.code === 11000 && err.keyValue && err.keyValue.slug) {
      return res.status(409).json({ success: false, message: 'A destination with this slug already exists. It may be hidden — check the admin list or update the existing destination.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    console.error('updateDestination error:', err && err.stack ? err.stack : err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted' });
  } catch (err) {
    console.error('deleteDestination error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};