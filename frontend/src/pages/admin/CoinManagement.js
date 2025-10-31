import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI, coinAPI } from '../../services/api';
import { PlusCircle, Edit2, Trash2, X, RefreshCw } from 'lucide-react';

const CoinManagement = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    currentPrice: '',
    profitPercentage: '',
    priceChange24h: '',
    icon: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, []);

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

  const handleAddCoin = () => {
    setEditingCoin(null);
    setFormData({
      name: '',
      symbol: '',
      currentPrice: '',
      profitPercentage: '',
      priceChange24h: '',
      icon: '',
    });
    setShowModal(true);
  };

  const handleEditCoin = (coin) => {
    setEditingCoin(coin);
    setFormData({
      name: coin.name,
      symbol: coin.symbol,
      currentPrice: coin.currentPrice,
      profitPercentage: coin.profitPercentage,
      priceChange24h: coin.priceChange24h,
      icon: coin.icon || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCoin) {
        await adminAPI.updateCoin(editingCoin._id, formData);
        setSuccess('Coin updated successfully');
      } else {
        await adminAPI.addCoin(formData);
        setSuccess('Coin added successfully');
      }
      setShowModal(false);
      fetchCoins();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteCoin = async (coinId) => {
    if (window.confirm('Are you sure you want to deactivate this coin?')) {
      try {
        await adminAPI.deleteCoin(coinId);
        setSuccess('Coin deactivated successfully');
        fetchCoins();
      } catch (error) {
        setError('Failed to deactivate coin');
      }
    }
  };

  const refreshPrices = async () => {
    setRefreshing(true);
    setError('');
    try {
      const response = await coinAPI.refreshPrices();
      setCoins(response.data.coins);
      setSuccess('Live prices updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setError('Failed to refresh prices');
    } finally {
      setRefreshing(false);
    }
  };

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
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-text-dark">Coin Management</h1>
            <div className="flex gap-3">
              <button
                onClick={refreshPrices}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Updating...' : 'Refresh Prices'}</span>
              </button>
              <button
                onClick={handleAddCoin}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-green to-primary-green-dark text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add New Coin</span>
              </button>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-primary-green">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Coin</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Symbol</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">24h Change</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Weekly Profit</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray">
                  {coins.map((coin) => (
                    <tr key={coin._id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-green">{coin.symbol.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-text-dark">{coin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-dark font-medium">{coin.symbol}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-dark">₹{coin.currentPrice?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${coin.priceChange24h >= 0 ? 'text-profit' : 'text-red-500'}`}>
                          {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h?.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-profit">{coin.profitPercentage?.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          coin.isActive
                            ? 'bg-success/10 text-success border border-success'
                            : 'bg-red-100 text-red-600 border border-red-400'
                        }`}>
                          {coin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCoin(coin)}
                            className="p-2 bg-primary-green/10 text-primary-green rounded-lg hover:bg-primary-green hover:text-white transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoin(coin._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-6 pb-4 border-b-2 border-primary-green">
              {editingCoin ? 'Edit Coin' : 'Add New Coin'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Coin Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Bitcoin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="BTC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Current Price (₹)</label>
                <input
                  type="number"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Weekly Profit (%)</label>
                <input
                  type="number"
                  value={formData.profitPercentage}
                  onChange={(e) => setFormData({ ...formData, profitPercentage: e.target.value })}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">24h Change (%)</label>
                <input
                  type="number"
                  value={formData.priceChange24h}
                  onChange={(e) => setFormData({ ...formData, priceChange24h: e.target.value })}
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {editingCoin ? 'Update Coin' : 'Add Coin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CoinManagement;
