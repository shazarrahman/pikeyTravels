const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const providerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hotel', 'cab', 'guide'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    select: false
  },
  images: [{
    type: String
  }],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  contactNumber: {
    type: String,
    required: true
  },
  idProofUrl: {
    type: String
  },
  description: {
    type: String
  },
  location: {
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
  extraFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pricePerDay: {
    type: Number,
    default: 0
  },
  // priceType controls whether provider is charged per day or as a single booking fee
  priceType: {
    type: String,
    enum: ['perDay', 'perBooking'],
    default: 'perDay'
  },
  pricePerBooking: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

providerSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

providerSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Provider', providerSchema);