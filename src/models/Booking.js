const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  selectedHotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  selectedCabId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  selectedGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  selectedAddOns: [{
    addOnId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddOnService' },
    label: String,
    price: Number
  }],
  travelDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  adminNote: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);