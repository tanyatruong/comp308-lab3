const mongoose = require('mongoose');

// Connect to MongoDB for Auth microservice
const connectAuthDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lab3-auth-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Auth MongoDB successfully');
  } catch (error) {
    console.error('Auth MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB for Vital Signs microservice
const connectVitalSignsDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lab3-vital-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Vital Signs MongoDB successfully');
  } catch (error) {
    console.error('Vital Signs MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectAuthDB,
  connectVitalSignsDB
};