const express = require('express');
const router = express.Router();
const {
  getCoins,
  getCoinById,
  refreshCoinPrices,
} = require('../controllers/coinController');

router.get('/', getCoins);
router.get('/refresh-prices', refreshCoinPrices);
router.get('/:id', getCoinById);

module.exports = router;
