const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getWallet,
  getInvestments,
  getTransactions,
  getSettings,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/wallet', protect, getWallet);
router.get('/investments', protect, getInvestments);
router.get('/transactions', protect, getTransactions);
router.get('/settings', protect, getSettings);

module.exports = router;
