const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'profit'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  coinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  paymentProof: {
    type: String,
  },
  adminNotes: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
