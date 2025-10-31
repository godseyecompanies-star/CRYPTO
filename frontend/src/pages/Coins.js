import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { coinAPI, transactionAPI, userAPI } from '../services/api';
import { TrendingUp, TrendingDown, Search, X, RefreshCw } from 'lucide-react';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coinQuantity, setCoinQuantity] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCoins();
    fetchWallet();
    
    // Auto-refresh prices every 2 minutes
    const interval = setInterval(() => {
      refreshPrices(true); // silent refresh
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate coin quantity when amount changes
  useEffect(() => {
    if (selectedCoin && investAmount) {
      const amount = parseFloat(investAmount);
      if (amount > 0 && selectedCoin.currentPrice > 0) {
        const quantity = amount / selectedCoin.currentPrice;
        setCoinQuantity(quantity);
      } else {
        setCoinQuantity(0);
      }
    } else {
      setCoinQuantity(0);
    }
  }, [investAmount, selectedCoin]);

  const fetchCoins = async () => {
    try {
      const response = await coinAPI.getCoins();
      setCoins(response.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrices = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const response = await coinAPI.refreshPrices();
      setCoins(response.data.coins);
      if (!silent) {
        setSuccess('Prices updated!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (error) {
      console.error('Error refreshing prices:', error);
      if (!silent) setError('Failed to refresh prices');
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await userAPI.getWallet();
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(investAmount);
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    try {
      await transactionAPI.createInvestment({
        coinId: selectedCoin._id,
        amount: amount,
      });
      setSuccess('Investment successful!');
      setSelectedCoin(null);
      setInvestAmount('');
      fetchWallet();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Investment failed');
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-green"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-4 md:mb-0">Available Coins</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refreshPrices()}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating...' : 'Refresh Prices'}
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-gray" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search coins..."
                  className="pl-10 pr-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                />
              </div>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoins.map((coin) => (
              <div
                key={coin._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-border-gray hover:border-primary-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-green">{coin.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-dark">{coin.name}</h3>
                      <p className="text-sm text-text-gray">{coin.symbol}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-gray">Current Price</span>
                    <span className="text-xl font-bold text-text-dark">₹{coin.currentPrice?.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-gray">24h Change</span>
                    <span className={`flex items-center font-semibold ${coin.priceChange24h >= 0 ? 'text-profit' : 'text-red-500'}`}>
                      {coin.priceChange24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {coin.priceChange24h?.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-success/20">
                    <span className="text-text-gray font-medium">Weekly Profit</span>
                    <span className="text-xl font-bold text-profit flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1" />
                      {coin.profitPercentage?.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCoin(coin)}
                  className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Invest Now
                </button>
              </div>
            ))}
          </div>

          {filteredCoins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-gray text-lg">No coins found</p>
            </div>
          )}
        </div>
      </div>

      {/* Investment Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setSelectedCoin(null);
                setInvestAmount('');
                setError('');
              }}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-2 pb-4 border-b-2 border-primary-green">
              Invest in {selectedCoin.name}
            </h2>

            <div className="my-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-gray">Coin Price</span>
                <span className="font-bold text-text-dark">₹{selectedCoin.currentPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Weekly Return</span>
                <span className="font-bold text-profit">{selectedCoin.profitPercentage?.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Wallet Balance</span>
                <span className="font-bold text-primary-green">₹{walletBalance?.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleInvest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Investment Amount (₹)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Enter amount"
                />
              </div>

              {investAmount && coinQuantity > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-primary-green/30">
                  <p className="text-sm text-text-gray mb-1">You will receive</p>
                  <p className="text-2xl font-bold text-primary-green">
                    {coinQuantity.toFixed(8)} {selectedCoin.symbol}
                  </p>
                  <p className="text-xs text-text-gray mt-2">
                    @ ₹{selectedCoin.currentPrice?.toLocaleString('en-IN')} per {selectedCoin.symbol}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Confirm Investment
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Coins;
