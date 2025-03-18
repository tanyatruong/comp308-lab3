const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  pulseRate: {
    type: Number,
    required: true,
    min: 0
  },
  bloodPressure: {
    type: String,
    required: true,
    // Format: systolic/diastolic (e.g. "120/80")
    validate: {
      validator: function(v) {
        return /^\d+\/\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid blood pressure format! Use format like "120/80"`
    }
  },
  temperature: {
    type: Number,
    required: true,
    min: 0
  },
  respiratoryRate: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VitalSign', vitalSignSchema);