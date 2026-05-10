const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hotel', 'cab', 'guide'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);