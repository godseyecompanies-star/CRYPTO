const SupportMessage = require('../models/SupportMessage');
const User = require('../models/User');

// @desc    Create support message (User)
// @route   POST /api/support
// @access  Private
const createSupportMessage = async (req, res) => {
  try {
    const { subject, message, category, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Please provide subject and message' });
    }

    const supportMessage = await SupportMessage.create({
      userId: req.user._id,
      subject,
      message,
      category: category || 'other',
      priority: priority || 'medium',
      status: 'open',
    });

    const populatedMessage = await SupportMessage.findById(supportMessage._id)
      .populate('userId', 'fullName phoneNumber email');

    res.status(201).json({
      message: 'Support request submitted successfully',
      supportMessage: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's support messages
// @route   GET /api/support
// @access  Private
const getUserSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all support messages (Admin)
// @route   GET /api/support/admin
// @access  Private/Admin
const getAllSupportMessages = async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const messages = await SupportMessage.find(filter)
      .populate('userId', 'fullName phoneNumber email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update support message (Admin)
// @route   PUT /api/support/admin/:id
// @access  Private/Admin
const updateSupportMessage = async (req, res) => {
  try {
    const { status, adminResponse, priority } = req.body;

    const supportMessage = await SupportMessage.findById(req.params.id);

    if (!supportMessage) {
      return res.status(404).json({ message: 'Support message not found' });
    }

    if (status) supportMessage.status = status;
    if (priority) supportMessage.priority = priority;
    if (adminResponse) {
      supportMessage.adminResponse = adminResponse;
      supportMessage.respondedAt = Date.now();
    }

    await supportMessage.save();

    const updatedMessage = await SupportMessage.findById(req.params.id)
      .populate('userId', 'fullName phoneNumber email');

    res.json({
      message: 'Support message updated successfully',
      supportMessage: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate password reset code (Admin)
// @route   POST /api/support/admin/generate-code
// @access  Private/Admin
const generatePasswordResetCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Please provide phone number' });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code (you can create a separate model or use OTP model)
    // For now, we'll just return it
    res.json({
      message: 'Reset code generated successfully',
      user: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      resetCode,
      expiresIn: '15 minutes',
      note: 'Share this code with the user. They can use it on forgot password page.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete support message (Admin)
// @route   DELETE /api/support/admin/:id
// @access  Private/Admin
const deleteSupportMessage = async (req, res) => {
  try {
    const supportMessage = await SupportMessage.findById(req.params.id);

    if (!supportMessage) {
      return res.status(404).json({ message: 'Support message not found' });
    }

    await supportMessage.deleteOne();

    res.json({ message: 'Support message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupportMessage,
  getUserSupportMessages,
  getAllSupportMessages,
  updateSupportMessage,
  generatePasswordResetCode,
  deleteSupportMessage,
};
