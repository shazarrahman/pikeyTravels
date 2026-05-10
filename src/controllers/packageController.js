const Package = require('../models/Package');

exports.getAllPackages = async (req, res) => {
  try {
    const { destinationId, q, provider } = req.query;
    const filter = { showOnFront: true };
    if (destinationId) filter.destinationId = destinationId;
    if (provider) {
      filter.$or = [
        { defaultHotelId: provider },
        { defaultCabId: provider },
        { defaultGuideId: provider },
        { altHotels: provider },
        { altCabs: provider },
        { altGuides: provider }
      ];
    }
    if (q) {
      filter.$or = filter.$or || [];
      const regex = new RegExp(q, 'i');
      filter.$or.push({ name: regex }, { description: regex });
    }

    const packages = await Package.find(filter)
      .populate('destinationId', 'name state')
      .populate('defaultHotelId', 'name images pricePerDay')
      .populate('defaultCabId', 'name images pricePerDay')
      .populate('defaultGuideId', 'name images pricePerDay')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPackagesAdmin = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('destinationId', 'name state')
      .populate('defaultHotelId', 'name')
      .populate('defaultCabId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ showOnFront: true, isFeatured: true })
      .populate('destinationId', 'name state')
      .populate('defaultHotelId', 'name images')
      .populate('defaultCabId', 'name images')
      .limit(6);
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('destinationId', 'name state slug')
      .populate('defaultHotelId', 'name images description location pricePerDay')
      .populate('altHotels', 'name images description location pricePerDay')
      .populate('defaultCabId', 'name images description pricePerDay')
      .populate('altCabs', 'name images description pricePerDay')
      .populate('defaultGuideId', 'name images description pricePerDay')
      .populate('altGuides', 'name images description pricePerDay')
      .populate('addOnServices', 'label description priceType price');
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};