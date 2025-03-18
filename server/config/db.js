const mongoose = require('mongoose');

const connectAuthDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/vital-signs-auth-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Auth MongoDB successfully');
  } catch (error) {
    console.error('Auth MongoDB connection error:', error);
    process.exit(1);
  }
};

const connectVitalSignsDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/vital-signs-service-db', {
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