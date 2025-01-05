const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'palcode', 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('\nDatabase Connection Info:');
    console.log(`✓ Connected to MongoDB Database: ${conn.connection.name}`);
    console.log(`✓ Host: ${conn.connection.host}`);
    console.log(`✓ Port: ${conn.connection.port}\n`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;