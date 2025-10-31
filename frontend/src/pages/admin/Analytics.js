import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-dark">Analytics & Reports</h1>
            <p className="text-text-gray mt-2">Detailed insights into platform performance</p>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-primary-green to-primary-green-dark rounded-2xl shadow-xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-lg mb-2">Total Revenue</p>
                <h2 className="text-5xl font-bold">₹{analytics?.totalRevenue?.toFixed(2) || '0.00'}</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                <DollarSign className="h-16 w-16" />
              </div>
            </div>
          </div>

          {/* Coin Purchase Analysis */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-6 w-6 text-primary-green" />
              <h2 className="text-2xl font-bold text-text-dark">Coin Purchase Analysis</h2>
            </div>

            {analytics?.coinPurchases && analytics.coinPurchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.coinPurchases.map((coin, index) => (
                  <div
                    key={index}
                    className="border-2 border-border-gray rounded-xl p-6 hover:border-primary-green hover:shadow-lg transition-all"
                  >
                    <h3 className="text-xl font-bold text-text-dark mb-4">{coin.coinName}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-text-gray">Total Purchases</span>
                        <span className="font-bold text-primary-green">{coin.count}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-gray">Total Amount</span>
                        <span className="font-bold text-text-dark">₹{coin.totalAmount?.toFixed(2)}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border-gray">
                        <div className="w-full bg-light-gray rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary-green to-profit h-3 rounded-full transition-all"
                            style={{ width: `${(coin.count / analytics.coinPurchases.reduce((sum, c) => sum + c.count, 0)) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-text-gray mt-2 text-center">
                          {((coin.count / analytics.coinPurchases.reduce((sum, c) => sum + c.count, 0)) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-gray py-8">No coin purchases yet</p>
            )}
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-primary-green" />
              <h2 className="text-2xl font-bold text-text-dark">User Growth</h2>
            </div>

            {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
              <div className="space-y-3">
                {analytics.userGrowth.slice(-10).map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border-gray rounded-lg hover:bg-light-gray transition-all"
                  >
                    <span className="text-text-dark font-medium">{day._id}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-light-gray rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-green to-profit h-3 rounded-full transition-all"
                          style={{ width: `${(day.count / Math.max(...analytics.userGrowth.map(d => d.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-primary-green w-12 text-right">{day.count}</span>
                      <span className="text-text-gray text-sm">users</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-gray py-8">No user growth data</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
