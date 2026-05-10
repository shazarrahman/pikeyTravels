const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('packageId', 'name durationDays')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'packageId',
        populate: [
          { path: 'defaultHotelId', select: 'name pricePerDay' },
          { path: 'defaultCabId', select: 'name pricePerDay' },
          { path: 'defaultGuideId', select: 'name pricePerDay' },
          { path: 'addOnServices', select: 'label price priceType' }
        ]
      })
      .populate('userId', 'name email phone')
      .populate('selectedHotelId', 'name images pricePerDay')
      .populate('selectedCabId', 'name images pricePerDay')
      .populate('selectedGuideId', 'name images pricePerDay')
      .populate('selectedAddOns.addOnId');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    // validate package guest limit
    const Package = require('../models/Package');
    if (req.body.packageId) {
      const pkg = await Package.findById(req.body.packageId).select('maxGuests name');
      if (pkg && pkg.maxGuests && req.body.guests > pkg.maxGuests) {
        return res.status(400).json({ success: false, message: `Cannot book more than ${pkg.maxGuests} guests for package: ${pkg.name}` });
      }
    }

    const booking = await Booking.create(req.body);
    // Send admin notification and customer confirmation if email provided
    (async () => {
      try {
        const SiteSettings = require('../models/SiteSettings');
        const settings = await SiteSettings.findOne();
        const adminEmails = [];
        if (process.env.ADMIN_EMAIL) adminEmails.push(process.env.ADMIN_EMAIL);
        if (settings && Array.isArray(settings.adminEmails)) settings.adminEmails.forEach(e => { if (e) adminEmails.push(e); });
        const uniqueAdmins = [...new Set(adminEmails)];
        const subject = `New booking received: ${booking._id}`;
        const html = `<p>New booking created:</p><pre>${JSON.stringify(booking, null, 2)}</pre>`;
        // notify admins
        await Promise.all(uniqueAdmins.map(email => sendEmail({ to: email, subject, html }).catch(err => console.error('booking admin email error', err && err.message))));
        // notify customer
        if (booking.contactEmail) {
          const custSub = `Booking confirmation - ${booking._id}`;
          const custHtml = `<p>Hi ${booking.contactName || ''},</p><p>Thanks for your booking request. We have received it and will process shortly.</p><pre>${JSON.stringify(booking, null, 2)}</pre>`;
          await sendEmail({ to: booking.contactEmail, subject: custSub, html: custHtml }).catch(err => console.error('booking customer email error', err && err.message));
        }
      } catch (emailErr) {
        console.error('Booking email error:', emailErr.message || emailErr);
      }
    })();

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const update = { status };
    if (adminNote) update.adminNote = adminNote;
    
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('packageId', 'name');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingsForProvider = async (req, res) => {
  try {
    const providerId = req.user && (req.user._id || req.user.id);
    if (!providerId) {
      return res.status(401).json({ success: false, message: 'Provider authentication required' });
    }

    const bookings = await Booking.find({
      $or: [
        { selectedHotelId: providerId },
        { selectedCabId: providerId },
        { selectedGuideId: providerId }
      ]
    })
      .populate('packageId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};