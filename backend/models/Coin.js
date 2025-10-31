const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Coin name is required'],
    trim: true,
  },
  symbol: {
    type: String,
    required: [true, 'Coin symbol is required'],
    trim: true,
    uppercase: true,
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
  },
  priceChange24h: {
    type: Number,
    default: 0,
  },
  profitPercentage: {
    type: Number,
    required: [true, 'Profit percentage is required'],
    default: 0,
  },
  icon: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coin', coinSchema);
