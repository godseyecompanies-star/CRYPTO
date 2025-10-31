const axios = require('axios');

// Map of coin symbols to CoinGecko IDs
const coinGeckoMap = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'ADA': 'cardano',
  'XRP': 'ripple',
  'USDT': 'tether',
  'DOGE': 'dogecoin',
  'MATIC': 'matic-network',
  'DOT': 'polkadot',
  'AVAX': 'avalanche-2',
  'SHIB': 'shiba-inu',
  'LTC': 'litecoin',
  'TRX': 'tron',
  'LINK': 'chainlink',
};

// Cache for price data (5 minute cache)
let priceCache = {};
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch real-time crypto prices from CoinGecko API
 * @param {Array} symbols - Array of coin symbols (e.g., ['BTC', 'ETH'])
 * @returns {Object} - Object with symbol as key and price data as value
 */
const fetchCryptoPrices = async (symbols = []) => {
  try {
    // Check cache
    const now = Date.now();
    if (now - lastFetchTime < CACHE_DURATION && Object.keys(priceCache).length > 0) {
      console.log('📊 Using cached crypto prices');
      return priceCache;
    }

    // Map symbols to CoinGecko IDs
    const coinIds = symbols
      .map(symbol => coinGeckoMap[symbol.toUpperCase()])
      .filter(Boolean)
      .join(',');

    if (!coinIds) {
      console.log('⚠️ No valid coin symbols provided, using fallback prices');
      return getFallbackPrices(symbols);
    }

    console.log('🔄 Fetching live crypto prices from CoinGecko...');
    
    // Fetch from CoinGecko API (free tier, no API key needed)
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: coinIds,
        vs_currencies: 'inr',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
      },
      timeout: 10000, // 10 second timeout
    });

    // Transform response to symbol-based format
    const prices = {};
    symbols.forEach(symbol => {
      const coinId = coinGeckoMap[symbol.toUpperCase()];
      if (coinId && response.data[coinId]) {
        prices[symbol.toUpperCase()] = {
          price: response.data[coinId].inr,
          change24h: response.data[coinId].inr_24h_change || 0,
          volume24h: response.data[coinId].inr_24h_vol || 0,
          lastUpdated: new Date(),
        };
      }
    });

    // Update cache
    priceCache = prices;
    lastFetchTime = now;

    console.log(`✅ Fetched prices for ${Object.keys(prices).length} coins`);
    return prices;

  } catch (error) {
    console.error('❌ Error fetching crypto prices:', error.message);
    
    // Return cached data if available
    if (Object.keys(priceCache).length > 0) {
      console.log('⚠️ Using stale cached prices due to API error');
      return priceCache;
    }
    
    // Return fallback prices if no cache
    console.log('⚠️ Using fallback prices due to API error');
    return getFallbackPrices(symbols);
  }
};

/**
 * Get fallback prices (used when API is unavailable)
 * These are approximate INR prices as of recent data
 */
const getFallbackPrices = (symbols) => {
  const fallbackPrices = {
    'BTC': { price: 3500000, change24h: 2.5, volume24h: 1000000000, lastUpdated: new Date() },
    'ETH': { price: 250000, change24h: 3.2, volume24h: 500000000, lastUpdated: new Date() },
    'BNB': { price: 45000, change24h: 1.8, volume24h: 100000000, lastUpdated: new Date() },
    'SOL': { price: 12000, change24h: 5.5, volume24h: 80000000, lastUpdated: new Date() },
    'ADA': { price: 45, change24h: -1.2, volume24h: 50000000, lastUpdated: new Date() },
    'XRP': { price: 55, change24h: 2.1, volume24h: 70000000, lastUpdated: new Date() },
    'USDT': { price: 83, change24h: 0.1, volume24h: 2000000000, lastUpdated: new Date() },
    'DOGE': { price: 12, change24h: 4.3, volume24h: 30000000, lastUpdated: new Date() },
    'MATIC': { price: 75, change24h: 3.5, volume24h: 40000000, lastUpdated: new Date() },
    'DOT': { price: 800, change24h: 2.8, volume24h: 35000000, lastUpdated: new Date() },
  };

  const result = {};
  symbols.forEach(symbol => {
    const upperSymbol = symbol.toUpperCase();
    if (fallbackPrices[upperSymbol]) {
      result[upperSymbol] = fallbackPrices[upperSymbol];
    }
  });

  return result;
};

/**
 * Update coin prices in database
 * @param {Model} Coin - Mongoose Coin model
 */
const updateCoinPrices = async (Coin) => {
  try {
    const coins = await Coin.find({ isActive: true });
    if (coins.length === 0) {
      console.log('⚠️ No active coins to update');
      return;
    }

    const symbols = coins.map(coin => coin.symbol);
    const prices = await fetchCryptoPrices(symbols);

    // Update each coin
    for (const coin of coins) {
      const priceData = prices[coin.symbol.toUpperCase()];
      if (priceData) {
        coin.currentPrice = priceData.price;
        coin.priceChange24h = priceData.change24h;
        await coin.save();
      }
    }

    console.log(`✅ Updated prices for ${coins.length} coins in database`);
    return prices;

  } catch (error) {
    console.error('❌ Error updating coin prices:', error.message);
    throw error;
  }
};

/**
 * Calculate coin quantity based on investment amount
 * @param {Number} investmentAmount - Amount in INR
 * @param {Number} coinPrice - Current coin price in INR
 * @returns {Number} - Coin quantity (fractional)
 */
const calculateCoinQuantity = (investmentAmount, coinPrice) => {
  return investmentAmount / coinPrice;
};

/**
 * Format coin quantity for display
 * @param {Number} quantity - Coin quantity
 * @param {String} symbol - Coin symbol
 * @returns {String} - Formatted quantity
 */
const formatCoinQuantity = (quantity, symbol) => {
  // For BTC, ETH use more decimal places
  if (['BTC', 'ETH'].includes(symbol.toUpperCase())) {
    return quantity.toFixed(8);
  }
  // For other coins
  return quantity.toFixed(6);
};

module.exports = {
  fetchCryptoPrices,
  updateCoinPrices,
  calculateCoinQuantity,
  formatCoinQuantity,
  getFallbackPrices,
};
