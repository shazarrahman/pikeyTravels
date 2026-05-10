const Provider = require('../models/Provider');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProviders = await Provider.countDocuments();
    const activePackages = await Package.countDocuments({ showOnFront: true });
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$totalPrice', 0] } } } }
    ]);
    const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

    const pendingProviders = await Provider.find({ status: 'pending' }).sort({ submittedAt: -1 }).limit(6).select('type name submittedAt');

    res.json({ success: true, data: { totalProviders, activePackages, totalBookings, revenue, pendingProviders } });
  } catch (err) {
    console.error('getDashboardStats error', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
