const express = require('express');
const router = express.Router();
const {
  createDeposit,
  createInvestment,
  createWithdrawal,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/deposit', protect, upload.single('paymentProof'), createDeposit);
router.post('/invest', protect, createInvestment);
router.post('/withdraw', protect, createWithdrawal);

module.exports = router;
