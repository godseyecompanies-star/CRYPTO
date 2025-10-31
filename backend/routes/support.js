const express = require('express');
const router = express.Router();
const {
  createSupportMessage,
  getUserSupportMessages,
  getAllSupportMessages,
  updateSupportMessage,
  generatePasswordResetCode,
  deleteSupportMessage,
} = require('../controllers/supportController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/', protect, createSupportMessage);
router.get('/', protect, getUserSupportMessages);

// Admin routes
router.get('/admin', protect, admin, getAllSupportMessages);
router.put('/admin/:id', protect, admin, updateSupportMessage);
router.delete('/admin/:id', protect, admin, deleteSupportMessage);
router.post('/admin/generate-code', protect, admin, generatePasswordResetCode);

module.exports = router;
