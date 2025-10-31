const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const { sendOTP, generateOTP } = require('../utils/sendOTP');
const { validatePasswordStrength, validatePhoneNumber, sanitizeInput } = require('../utils/validators');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { phoneNumber, password, fullName, email, referralCode } = req.body;

    // Validation
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors 
      });
    }

    // Sanitize inputs
    const sanitizedFullName = sanitizeInput(fullName);
    const sanitizedEmail = email ? sanitizeInput(email) : undefined;

    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Check referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // Create user
    const user = await User.create({
      phoneNumber,
      password,
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      referredBy: referrer ? referrer._id : null,
      referralBonus: referrer ? 200 : 0, // 200 Rs bonus if referred
    });

    // Generate and save referral code for new user
    user.referralCode = user.generateReferralCode();
    await user.save();

    // Add to referrer's referrals list
    if (referrer) {
      referrer.referrals.push({
        userId: user._id,
        bonusPaid: false,
      });
      await referrer.save();
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        referralBonus: user.referralBonus,
        token: generateToken(user._id),
        message: referrer ? 'Account created! ₹200 referral bonus pending admin approval.' : 'Account created successfully!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Please provide phone number and password' });
    }

    // Check for user
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      referralBonus: user.referralBonus,
      referralBonusApproved: user.referralBonusApproved,
      hasInvested: user.hasInvested,
      referrals: user.referrals,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Please provide phone number' });
    }

    // Check if user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this phone number' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      phoneNumber,
      otp,
    });

    // Send OTP
    const result = await sendOTP(phoneNumber, otp);

    if (result.success) {
      res.json({ message: 'OTP sent successfully to your phone number' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Please provide phone number and OTP' });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      phoneNumber,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    if (!phoneNumber || !newPassword) {
      return res.status(400).json({ message: 'Please provide phone number and new password' });
    }

    // Check if there's a verified OTP (used within last 10 minutes)
    const recentOTP = await OTP.findOne({
      phoneNumber,
      isUsed: true,
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (!recentOTP) {
      return res.status(400).json({ message: 'Please verify OTP first' });
    }

    // Find user and update password
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getMe,
  changePassword,
};
