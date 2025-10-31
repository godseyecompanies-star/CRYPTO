const Coin = require('../models/Coin');
const { updateCoinPrices } = require('../services/cryptoPriceService');

// @desc    Get all active coins
// @route   GET /api/coins
// @access  Public
const getCoins = async (req, res) => {
  try {
    const coins = await Coin.find({ isActive: true }).sort({ currentPrice: -1 });
    res.json(coins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single coin
// @route   GET /api/coins/:id
// @access  Public
const getCoinById = async (req, res) => {
  try {
    const coin = await Coin.findById(req.params.id);

    if (coin) {
      res.json(coin);
    } else {
      res.status(404).json({ message: 'Coin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh coin prices from live API
// @route   GET /api/coins/refresh-prices
// @access  Public
const refreshCoinPrices = async (req, res) => {
  try {
    await updateCoinPrices(Coin);
    const coins = await Coin.find({ isActive: true }).sort({ currentPrice: -1 });
    res.json({
      message: 'Prices updated successfully',
      coins,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoins,
  getCoinById,
  refreshCoinPrices,
};
