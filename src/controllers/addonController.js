const AddOnService = require('../models/AddOnService');

exports.getAllAddOns = async (req, res) => {
  try {
    const addOns = await AddOnService.find({ showOnFront: true }).sort({ label: 1 });
    res.json({ success: true, data: addOns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllAddOnsAdmin = async (req, res) => {
  try {
    const addOns = await AddOnService.find().sort({ createdAt: -1 });
    res.json({ success: true, data: addOns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAddOnById = async (req, res) => {
  try {
    const addOn = await AddOnService.findById(req.params.id);
    if (!addOn) {
      return res.status(404).json({ success: false, message: 'Add-on not found' });
    }
    res.json({ success: true, data: addOn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAddOn = async (req, res) => {
  try {
    const addOn = await AddOnService.create(req.body);
    res.status(201).json({ success: true, data: addOn });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateAddOn = async (req, res) => {
  try {
    const addOn = await AddOnService.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!addOn) {
      return res.status(404).json({ success: false, message: 'Add-on not found' });
    }
    res.json({ success: true, data: addOn });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.toggleShowOnFront = async (req, res) => {
  try {
    const addOn = await AddOnService.findById(req.params.id);
    if (!addOn) {
      return res.status(404).json({ success: false, message: 'Add-on not found' });
    }
    addOn.showOnFront = !addOn.showOnFront;
    await addOn.save();
    res.json({ success: true, data: addOn });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteAddOn = async (req, res) => {
  try {
    const addOn = await AddOnService.findByIdAndDelete(req.params.id);
    if (!addOn) {
      return res.status(404).json({ success: false, message: 'Add-on not found' });
    }
    res.json({ success: true, message: 'Add-on deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};