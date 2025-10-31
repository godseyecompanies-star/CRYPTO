const User = require('../models/User');
const Coin = require('../models/Coin');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalInvestments = await Transaction.aggregate([
      { $match: { type: 'investment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });

    const totalProfitDistributed = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalProfit' } } }
    ]);

    res.json({
      totalUsers,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalInvestments: totalInvestments[0]?.total || 0,
      totalProfitDistributed: totalProfitDistributed[0]?.total || 0,
      pendingTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('investments.coinId');
    
    if (user) {
      const transactions = await Transaction.find({ userId: user._id })
        .populate('coinId')
        .sort({ createdAt: -1 });
      
      res.json({ user, transactions });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add/deduct money from user wallet
// @route   PUT /api/admin/users/:id/wallet
// @access  Private/Admin
const updateUserWallet = async (req, res) => {
  try {
    const { amount, action } = req.body;

    if (!amount || !action) {
      return res.status(400).json({ message: 'Please provide amount and action' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add') {
      user.walletBalance += parseFloat(amount);
    } else if (action === 'deduct') {
      if (user.walletBalance < amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.walletBalance -= parseFloat(amount);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();

    res.json({
      message: `Successfully ${action === 'add' ? 'added' : 'deducted'} amount`,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate/deactivate user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .populate('userId', 'fullName phoneNumber')
      .populate('coinId')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/reject transaction
// @route   PUT /api/admin/transactions/:id
// @access  Private/Admin
const updateTransaction = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = status;
    if (adminNotes) {
      transaction.adminNotes = adminNotes;
    }

    if (status === 'approved' && transaction.type === 'deposit') {
      const user = await User.findById(transaction.userId);
      user.walletBalance += transaction.amount;
      await user.save();
    } else if (status === 'approved' && transaction.type === 'withdrawal') {
      const user = await User.findById(transaction.userId);
      user.walletBalance -= transaction.amount;
      await user.save();
    }

    await transaction.save();

    res.json({
      message: `Transaction ${status} successfully`,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new coin
// @route   POST /api/admin/coins
// @access  Private/Admin
const addCoin = async (req, res) => {
  try {
    const { name, symbol, currentPrice, profitPercentage, priceChange24h, icon } = req.body;

    if (!name || !symbol || !currentPrice || profitPercentage === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const coin = await Coin.create({
      name,
      symbol,
      currentPrice,
      profitPercentage,
      priceChange24h: priceChange24h || 0,
      icon: icon || '',
    });

    res.status(201).json(coin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coin
// @route   PUT /api/admin/coins/:id
// @access  Private/Admin
const updateCoin = async (req, res) => {
  try {
    const { name, symbol, currentPrice, profitPercentage, priceChange24h, icon, isActive } = req.body;

    const coin = await Coin.findById(req.params.id);

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    coin.name = name || coin.name;
    coin.symbol = symbol || coin.symbol;
    coin.currentPrice = currentPrice !== undefined ? currentPrice : coin.currentPrice;
    coin.profitPercentage = profitPercentage !== undefined ? profitPercentage : coin.profitPercentage;
    coin.priceChange24h = priceChange24h !== undefined ? priceChange24h : coin.priceChange24h;
    coin.icon = icon !== undefined ? icon : coin.icon;
    coin.isActive = isActive !== undefined ? isActive : coin.isActive;

    const updatedCoin = await coin.save();

    res.json(updatedCoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coin (set inactive)
// @route   DELETE /api/admin/coins/:id
// @access  Private/Admin
const deleteCoin = async (req, res) => {
  try {
    const coin = await Coin.findById(req.params.id);

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    coin.isActive = false;
    await coin.save();

    res.json({ message: 'Coin deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const coinPurchases = await Transaction.aggregate([
      { $match: { type: 'investment' } },
      { $group: { _id: '$coinId', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
      { $lookup: { from: 'coins', localField: '_id', foreignField: '_id', as: 'coin' } },
      { $unwind: '$coin' },
      { $project: { coinName: '$coin.name', count: 1, totalAmount: 1 } }
    ]);

    const userGrowth = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const revenue = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      coinPurchases,
      userGrowth,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get/Update settings
// @route   GET/PUT /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
      console.log('✅ Created new settings document');
    }

    // Handle file upload for QR code (always saves as payment-qr-code.png, overwrites automatically)
    if (req.file) {
      const fs = require('fs');
      const newPath = req.file.path.replace(/\\/g, '/');
      settings.qrCodeImage = newPath;
      
      // Convert to base64 and store in database (for ephemeral file systems like Render)
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
      settings.qrCodeBase64 = base64Image;
      
      console.log('✅ QR code saved:', newPath);
      console.log('✅ QR code stored in database as base64');
    }
    
    if (req.body.maintenanceMode !== undefined) {
      settings.maintenanceMode = req.body.maintenanceMode;
    }
    if (req.body.platformFee !== undefined) {
      settings.platformFee = req.body.platformFee;
    }

    const updatedSettings = await settings.save();
    console.log('✅ Database updated with QR path:', updatedSettings.qrCodeImage);
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users with pending referral bonuses
// @route   GET /api/admin/referrals
// @access  Private/Admin
const getReferralUsers = async (req, res) => {
  try {
    const users = await User.find({
      referralBonus: { $gt: 0 },
      referralBonusApproved: false,
    })
    .populate('referredBy', 'fullName phoneNumber referralCode')
    .select('fullName phoneNumber email referralBonus hasInvested createdAt referredBy')
    .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve referral bonus for user
// @route   PUT /api/admin/referrals/:id/approve
// @access  Private/Admin
const approveReferralBonus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referralBonusApproved) {
      return res.status(400).json({ message: 'Referral bonus already approved' });
    }

    if (user.referralBonus <= 0) {
      return res.status(400).json({ message: 'No referral bonus to approve' });
    }

    // Add bonus to wallet
    user.walletBalance += user.referralBonus;
    user.referralBonusApproved = true;

    await user.save();

    res.json({
      message: `₹${user.referralBonus} referral bonus approved and added to wallet`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        walletBalance: user.walletBalance,
        referralBonus: user.referralBonus,
        referralBonusApproved: user.referralBonusApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get referral statistics
// @route   GET /api/admin/referrals/stats
// @access  Private/Admin
const getReferralStats = async (req, res) => {
  try {
    const totalReferrals = await User.countDocuments({ referredBy: { $ne: null } });
    const pendingBonuses = await User.countDocuments({
      referralBonus: { $gt: 0 },
      referralBonusApproved: false,
    });
    const approvedBonuses = await User.countDocuments({ referralBonusApproved: true });
    
    const totalBonusPending = await User.aggregate([
      { $match: { referralBonus: { $gt: 0 }, referralBonusApproved: false } },
      { $group: { _id: null, total: { $sum: '$referralBonus' } } }
    ]);

    const totalBonusPaid = await User.aggregate([
      { $match: { referralBonusApproved: true } },
      { $group: { _id: null, total: { $sum: '$referralBonus' } } }
    ]);

    res.json({
      totalReferrals,
      pendingBonuses,
      approvedBonuses,
      totalBonusPending: totalBonusPending[0]?.total || 0,
      totalBonusPaid: totalBonusPaid[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  updateUserWallet,
  updateUserStatus,
  getTransactions,
  updateTransaction,
  addCoin,
  updateCoin,
  deleteCoin,
  getAnalytics,
  getSettings,
  updateSettings,
  getReferralUsers,
  approveReferralBonus,
  getReferralStats,
};
