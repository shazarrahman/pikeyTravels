const mongoose = require('mongoose');

const addOnServiceSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  priceType: {
    type: String,
    enum: ['flat', 'perDay'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  showOnFront: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AddOnService', addOnServiceSchema);