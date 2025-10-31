const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('investments.coinId');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        phoneNumber: updatedUser.phoneNumber,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wallet balance
// @route   GET /api/user/wallet
// @access  Private
const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance totalInvested totalProfit');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user investments
// @route   GET /api/user/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('investments.coinId');
    res.json(user.investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/user/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('coinId')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform settings (QR code, etc.)
// @route   GET /api/user/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        qrCodeImage: '',
        maintenanceMode: false,
        platformFee: 0,
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getWallet,
  getInvestments,
  getTransactions,
  getSettings,
};
