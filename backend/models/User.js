const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  investments: [{
    coinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coin',
    },
    coinName: String,
    coinSymbol: String,
    amountInvested: Number,
    coinQuantity: Number, // Fractional coin amount (e.g., 0.000123 BTC)
    purchasePrice: Number, // Price at time of purchase
    currentValue: Number,
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    profitPercentage: Number,
  }],
  totalInvested: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  referralBonus: {
    type: Number,
    default: 0,
  },
  referralBonusApproved: {
    type: Boolean,
    default: false,
  },
  hasInvested: {
    type: Boolean,
    default: false,
  },
  referrals: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    bonusPaid: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate referral code
userSchema.methods.generateReferralCode = function() {
  // Extract middle 6 digits from phone number
  const digits = this.phoneNumber.replace(/\D/g, ''); // Remove non-digits
  const startIndex = Math.floor((digits.length - 6) / 2);
  const middle6 = digits.substring(startIndex, startIndex + 6);
  
  // Generate random 4 character alphanumeric
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // Mix them: first 3 of middle6 + random 4 + last 3 of middle6
  const referralCode = middle6.substring(0, 3) + randomChars + middle6.substring(3, 6);
  
  return referralCode;
};

module.exports = mongoose.model('User', userSchema);
