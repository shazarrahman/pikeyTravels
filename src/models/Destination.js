const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  state: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  bestTime: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Use a synchronous pre-save hook (avoid calling a possibly undefined `next`)
destinationSchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

module.exports = mongoose.model('Destination', destinationSchema);