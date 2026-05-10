const SiteSettings = require('../models/SiteSettings');

exports.getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBranding = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ branding: req.body });
    } else {
      settings.branding = { ...settings.branding, ...req.body };
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ hero: req.body });
    } else {
      settings.hero = { ...settings.hero, ...req.body };
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateSections = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    // Normalize incoming payload: allow boolean values for visibility
    const incoming = {};
    Object.keys(req.body || {}).forEach((key) => {
      const val = req.body[key];
      if (typeof val === 'boolean') {
        incoming[key] = { isVisible: val };
      } else if (val && typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, 'isVisible')) {
        incoming[key] = val;
      } else {
        incoming[key] = val;
      }
    });

    if (!settings) {
      settings = await SiteSettings.create({ sections: incoming });
    } else {
      settings.sections = { ...settings.sections, ...incoming };
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ footer: req.body });
    } else {
      settings.footer = { ...settings.footer, ...req.body };
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateNavItems = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ navItems: req.body });
    } else {
      settings.navItems = req.body;
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};