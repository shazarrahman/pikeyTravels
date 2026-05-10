const Provider = require('../models/Provider');
const SiteSettings = require('../models/SiteSettings');
const sendEmail = require('../utils/sendEmail');

exports.getAllProviders = async (req, res) => {
  try {
    const { type, status, showOnFront } = req.query;
    const filter = { status: 'approved' };
    if (type) filter.type = type;
    if (showOnFront === 'true') filter.showOnFront = true;
    
    const providers = await Provider.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProvidersAdmin = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const providers = await Provider.find(filter)
      .populate('categoryId', 'name')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('categoryId', 'name');
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkProviderByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'email query required' });
    // Prevent intermediate caches and conditional requests from returning 304
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const provider = await Provider.findOne({ email }).select('-password');
    if (!provider) return res.status(200).json({ success: true, data: null });
    return res.status(200).json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProvider = async (req, res) => {
  try {
    const data = { ...req.body };
    const mongoose = require('mongoose');

    // Handle uploaded files (Cloudinary via multer-storage-cloudinary)
    if (req.files) {
      if (req.files.images) {
        data.images = req.files.images.map(f => f.path || f.secure_url || f.url || f.filename);
      }
      if (req.files.idProofUrl && req.files.idProofUrl[0]) {
        const f = req.files.idProofUrl[0];
        data.idProofUrl = f.path || f.secure_url || f.url || f.filename;
      }
    }

    // Basic server-side validation (after mapping files)
    if (data.email && !data.password) {
      return res.status(400).json({ success: false, message: 'Password is required when email is provided' });
    }
    if (!data.contactNumber) {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
    if (!data.idProofUrl) {
      return res.status(400).json({ success: false, message: 'ID proof is required' });
    }
    if (data.categoryId && !mongoose.Types.ObjectId.isValid(data.categoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid categoryId' });
    }

    const provider = await Provider.create(data);

    // Notify superadmin emails configured in SiteSettings (non-blocking)
    (async () => {
      try {
        const settings = await SiteSettings.findOne();
        const adminEmails = [];
        if (process.env.ADMIN_EMAIL) adminEmails.push(process.env.ADMIN_EMAIL);
        if (settings && Array.isArray(settings.adminEmails)) {
          settings.adminEmails.forEach(e => { if (e) adminEmails.push(e); });
        }
        // remove duplicates
        const unique = [...new Set(adminEmails)];
        if (unique.length > 0) {
          const subject = `New provider registration: ${provider.name || provider._id}`;
          const html = `<p>A new provider has registered:</p><pre>${JSON.stringify(provider, null, 2)}</pre>`;
          // Log admin recipients to backend log file for traceability
          try {
            const fs = require('fs');
            const path = require('path');
            const logPath = path.join(__dirname, '..', '..', 'dev_back.log');
            const entry = `[${new Date().toISOString()}] notify-admins: ${unique.join(', ')} for provider ${provider._id}\n`;
            fs.appendFile(logPath, entry, () => {});
          } catch (e) {
            console.error('log write failed', e && e.message);
          }
          await Promise.all(unique.map(email => sendEmail({ to: email, subject, html }).catch(err => console.error('provider email error', err && err.message))));
        }
      } catch (err) {
        console.error('notify admin error', err && err.message);
      }
    })();

    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    console.error('createProvider error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedAt: new Date(), showOnFront: true },
      { new: true }
    );
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.rejectProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedAt: new Date() },
      { new: true }
    );
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.toggleShowOnFront = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    provider.showOnFront = !provider.showOnFront;
    await provider.save();
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, message: 'Provider deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await Provider.findOne({ email }).select('+password');
    
    if (!provider) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await provider.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // Block login if provider is not approved
    if (provider.status !== 'approved') {
      const msg = provider.status === 'pending' ? 'Your registration is pending review' : 'Your application was rejected';
      return res.status(403).json({ success: false, message: msg });
    }
    
    const token = require('jsonwebtoken').sign(
      { id: provider._id, role: 'provider', type: provider.type },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({ 
      success: true, 
      token,
      data: {
        _id: provider._id,
        name: provider.name,
        type: provider.type,
        email: provider.email,
        location: provider.location,
        contactNumber: provider.contactNumber,
        status: provider.status,
        showOnFront: provider.showOnFront
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};