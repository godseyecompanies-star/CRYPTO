const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Coin = require('../models/Coin');
const { calculateCoinQuantity } = require('../services/cryptoPriceService');

// @desc    Create deposit request
// @route   POST /api/transactions/deposit
// @access  Private
const createDeposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid amount' });
    }

    // Get payment proof from uploaded file
    const paymentProof = req.file ? req.file.path : '';

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'deposit',
      amount,
      paymentProof,
      status: 'pending',
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create investment
// @route   POST /api/transactions/invest
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const { coinId, amount } = req.body;

    if (!coinId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid coin and amount' });
    }

    const user = await User.findById(req.user._id);
    const coin = await Coin.findById(coinId);

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    if (!coin.isActive) {
      return res.status(400).json({ message: 'This coin is not available for investment' });
    }

    // Check if user has sufficient balance
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Calculate coin quantity based on current price
    const coinQuantity = calculateCoinQuantity(amount, coin.currentPrice);

    // Deduct from wallet
    user.walletBalance -= amount;
    user.totalInvested += amount;

    // Mark user as having invested (required for referral bonus withdrawal)
    if (!user.hasInvested) {
      user.hasInvested = true;
    }

    // Add to investments with coin fraction
    user.investments.push({
      coinId: coin._id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      amountInvested: amount,
      coinQuantity: coinQuantity,
      purchasePrice: coin.currentPrice,
      currentValue: amount,
      profitPercentage: coin.profitPercentage,
    });

    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'investment',
      amount,
      coinId: coin._id,
      status: 'approved',
    });

    res.status(201).json({
      message: 'Investment successful',
      transaction,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create withdrawal request
// @route   POST /api/transactions/withdraw
// @access  Private
const createWithdrawal = async (req, res) => {
  try {
    const { amount, accountNumber, ifscCode, accountHolderName } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid amount' });
    }

    if (!accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ message: 'Please provide bank account details' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if user is trying to withdraw referral bonus without investing
    if (user.referralBonus > 0 && !user.hasInvested) {
      return res.status(400).json({ 
        message: `You have ₹${user.referralBonus} referral bonus. You must invest in at least one coin before you can withdraw your referral bonus.`,
        requiresInvestment: true
      });
    }
    
    // Minimum balance requirement: ₹200
    const MIN_BALANCE = 200;
    
    // Calculate 2% bank charges
    const bankCharges = (amount * 2) / 100;
    const totalRequired = amount + MIN_BALANCE;
    
    // Check if user has enough balance (withdrawal amount + minimum balance to maintain)
    if (user.walletBalance < totalRequired) {
      return res.status(400).json({ 
        message: `Insufficient balance. You need ₹${totalRequired} (₹${amount} withdrawal + ₹${MIN_BALANCE} minimum balance). Current balance: ₹${user.walletBalance}` 
      });
    }

    // Amount user will receive after bank charges
    const amountAfterCharges = amount - bankCharges;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      adminNotes: `Bank Charges (2%): ₹${bankCharges.toFixed(2)} | Amount to receive: ₹${amountAfterCharges.toFixed(2)} | Account: ${accountNumber} | IFSC: ${ifscCode} | Name: ${accountHolderName}`,
    });

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      transaction,
      bankCharges: bankCharges.toFixed(2),
      amountAfterCharges: amountAfterCharges.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDeposit,
  createInvestment,
  createWithdrawal,
};
