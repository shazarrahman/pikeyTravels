const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pikeytravels';
  
  try {
    if (mongoUri.includes('YOUR_PASSWORD')) {
      console.log('⚠️  MongoDB not configured. Using placeholder URI.');
      console.log('Please update .env with your MongoDB connection string.');
      return;
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Running without database in development mode');
    }
  }
};

module.exports = connectDB;