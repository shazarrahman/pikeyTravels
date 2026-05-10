const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  coverImage: {
    type: String
  },
  basePrice: {
    type: Number,
    required: true
  },
  configuredPrice: {
    type: Number
  },
  description: {
    type: String
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  includes: [{
    type: String
  }],
  excludes: [{
    type: String
  }],
  defaultHotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  altHotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
  defaultCabId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  altCabs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
  defaultGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  altGuides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
    maxGuests: { type: Number, default: 10 },
  addOnServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddOnService'
  }],
  showOnFront: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);