const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  qrCodeImage: {
    type: String,
    default: '',
  },
  qrCodeBase64: {
    type: String,
    default: '',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  platformFee: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
