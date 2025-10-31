import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI, transactionAPI } from '../services/api';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, PlusCircle, Coins as CoinsIcon, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, investmentsRes, transactionsRes] = await Promise.all([
        userAPI.getWallet(),
        userAPI.getInvestments(),
        userAPI.getTransactions(),
      ]);
      setWallet(walletRes.data);
      setInvestments(investmentsRes.data);
      setTransactions(transactionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
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
      <div className="min-h-screen bg-off-white py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-primary-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary-green/10 rounded-full p-3">
                  <Wallet className="h-8 w-8 text-primary-green" />
                </div>
                <span className="text-sm text-text-gray">Available</span>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">₹{wallet?.walletBalance?.toFixed(2) || '0.00'}</h3>
              <p className="text-text-gray mt-1">Wallet Balance</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-profit hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-profit/10 rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-profit" />
                </div>
                <span className="text-sm text-text-gray">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">₹{wallet?.totalInvested?.toFixed(2) || '0.00'}</h3>
              <p className="text-text-gray mt-1">Total Invested</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-success hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-success/10 rounded-full p-3">
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
                <span className="text-sm text-text-gray">Earned</span>
              </div>
              <h3 className="text-3xl font-bold text-profit">₹{wallet?.totalProfit?.toFixed(2) || '0.00'}</h3>
              <p className="text-text-gray mt-1">Total Profit</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/add-money"
              className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">Add Money</h3>
                <p className="text-white/80">Deposit funds to your wallet</p>
              </div>
              <PlusCircle className="h-12 w-12" />
            </Link>

            <Link
              to="/coins"
              className="bg-white border-2 border-primary-green text-primary-green rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl hover:bg-primary-green/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">View Coins</h3>
                <p className="text-text-gray">Explore investment options</p>
              </div>
              <CoinsIcon className="h-12 w-12" />
            </Link>

            <Link
              to="/referrals"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
                <p className="text-white/80">Get ₹200 per referral</p>
              </div>
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </Link>
          </div>

          {/* Investment Summary */}
          {investments.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-dark">My Investments</h2>
                <Link to="/investments" className="text-primary-green font-semibold hover:underline flex items-center">
                  View All <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investments.slice(0, 3).map((investment, index) => (
                  <div key={index} className="border border-border-gray rounded-xl p-4 hover:border-primary-green transition-all">
                    <h3 className="font-bold text-text-dark mb-2">{investment.coinName}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-text-gray">Invested: ₹{investment.amountInvested?.toFixed(2)}</p>
                      <p className="text-sm text-text-gray">Current: ₹{investment.currentValue?.toFixed(2)}</p>
                      <p className={`text-sm font-semibold ${investment.currentValue >= investment.amountInvested ? 'text-profit' : 'text-red-500'}`}>
                        Profit: {investment.profitPercentage?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-dark">Recent Transactions</h2>
              <Link to="/transactions" className="text-primary-green font-semibold hover:underline flex items-center">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border border-border-gray rounded-lg hover:bg-light-gray transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'approved' ? 'bg-success/10' :
                        transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {transaction.status === 'approved' && <CheckCircle className="h-5 w-5 text-success" />}
                        {transaction.status === 'pending' && <Clock className="h-5 w-5 text-yellow-600" />}
                        {transaction.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-text-dark capitalize">{transaction.type}</p>
                        <p className="text-sm text-text-gray">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-dark">₹{transaction.amount?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'approved' ? 'bg-success/10 text-success' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-gray py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
