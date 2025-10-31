import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userAPI } from '../services/api';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await userAPI.getInvestments();
      setInvestments(response.data);
    } catch (error) {
      console.error('Error fetching investments:', error);
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

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalProfitPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">My Investments</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-primary-green">
              <h3 className="text-text-gray text-sm mb-2">Total Invested</h3>
              <p className="text-3xl font-bold text-text-dark">₹{totalInvested.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-profit">
              <h3 className="text-text-gray text-sm mb-2">Current Value</h3>
              <p className="text-3xl font-bold text-text-dark">₹{totalCurrentValue.toFixed(2)}</p>
            </div>

            <div className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${totalProfit >= 0 ? 'border-success' : 'border-red-500'}`}>
              <h3 className="text-text-gray text-sm mb-2">Total Profit/Loss</h3>
              <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-red-500'}`}>
                {totalProfit >= 0 ? '+' : ''}₹{totalProfit.toFixed(2)}
              </p>
              <p className={`text-sm font-semibold mt-1 ${totalProfit >= 0 ? 'text-profit' : 'text-red-500'}`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfitPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Investments Grid */}
          {investments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((investment, index) => {
                const profit = investment.currentValue - investment.amountInvested;
                const profitPercentage = ((profit / investment.amountInvested) * 100);

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-border-gray hover:border-primary-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-primary-green">
                            {investment.coinName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-text-dark">{investment.coinName}</h3>
                          <p className="text-sm text-text-gray">Active Investment</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {investment.coinQuantity && (
                        <div className="flex justify-between items-center pb-3 border-b border-border-gray bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                          <span className="text-text-gray font-medium">Coin Holdings</span>
                          <span className="font-bold text-primary-green">
                            {investment.coinQuantity.toFixed(8)} {investment.coinSymbol || ''}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border-gray">
                        <span className="text-text-gray">Amount Invested</span>
                        <span className="font-bold text-text-dark">₹{investment.amountInvested?.toFixed(2)}</span>
                      </div>

                      {investment.purchasePrice && (
                        <div className="flex justify-between items-center pb-3 border-b border-border-gray">
                          <span className="text-text-gray text-sm">Purchase Price</span>
                          <span className="font-semibold text-text-dark text-sm">₹{investment.purchasePrice?.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pb-3 border-b border-border-gray">
                        <span className="text-text-gray">Current Value</span>
                        <span className="font-bold text-text-dark">₹{investment.currentValue?.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-border-gray">
                        <span className="text-text-gray">Weekly Return</span>
                        <span className="font-bold text-profit">{investment.profitPercentage?.toFixed(2)}%</span>
                      </div>

                      <div className={`flex justify-between items-center p-3 rounded-lg ${profit >= 0 ? 'bg-green-50 border border-success/20' : 'bg-red-50 border border-red-200'}`}>
                        <span className="text-text-gray font-medium">Profit/Loss</span>
                        <div className="text-right">
                          <p className={`font-bold flex items-center ${profit >= 0 ? 'text-profit' : 'text-red-500'}`}>
                            {profit >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)}
                          </p>
                          <p className={`text-sm font-semibold ${profit >= 0 ? 'text-profit' : 'text-red-500'}`}>
                            {profit >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-text-gray text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Purchase Date
                        </span>
                        <span className="text-text-dark text-sm font-medium">
                          {new Date(investment.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-text-gray" />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">No Investments Yet</h3>
              <p className="text-text-gray mb-6">Start investing in cryptocurrencies to see your portfolio here</p>
              <a
                href="/coins"
                className="inline-block bg-gradient-to-r from-primary-green to-primary-green-dark text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse Coins
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Investments;
