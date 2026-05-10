const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read .env from project root and extract MONGO_URI
const envPath = path.resolve(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env not found at', envPath);
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8');
const match = env.match(/^MONGO_URI=(.*)$/m);
if (!match) {
  console.error('MONGO_URI not found in .env');
  process.exit(1);
}

const MONGO_URI = match[1].trim();

const Provider = require('../models/Provider');

const approveByEmail = async (email) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const provider = await Provider.findOne({ email });
    if (!provider) {
      console.error('Provider not found with email', email);
      await mongoose.disconnect();
      process.exit(1);
    }

    provider.status = 'approved';
    provider.showOnFront = true;
    provider.reviewedAt = new Date();
    await provider.save();

    console.log('Provider approved:', provider._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error approving provider:', err.message);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.error('Usage: node approveProviderByEmail.js provider@example.com');
  process.exit(1);
}

approveByEmail(email);
