const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true
  },
  reviewerImage: {
    type: String
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  serviceType: {
    type: String,
    enum: ['hotel', 'cab', 'guide', 'overall'],
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  showOnFront: {
    type: Boolean,
    default: false
  },
  destination: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);