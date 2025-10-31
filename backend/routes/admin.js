const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// All routes require authentication and admin role
router.use(protect);
router.use(adminAuth);

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/wallet', updateUserWallet);
router.put('/users/:id/status', updateUserStatus);

// Transaction management
router.get('/transactions', getTransactions);
router.put('/transactions/:id', updateTransaction);

// Coin management
router.post('/coins', addCoin);
router.put('/coins/:id', updateCoin);
router.delete('/coins/:id', deleteCoin);

// Analytics
router.get('/analytics', getAnalytics);

// Settings
router.get('/settings', getSettings);
router.put('/settings', upload.single('qrCode'), updateSettings);

// Referral management
router.get('/referrals', getReferralUsers);
router.get('/referrals/stats', getReferralStats);
router.put('/referrals/:id/approve', approveReferralBonus);

module.exports = router;
