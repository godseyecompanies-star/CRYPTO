import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import { Users, DollarSign, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            <h1 className="text-3xl font-bold text-text-dark">Admin Dashboard</h1>
            <p className="text-text-gray mt-2">Manage your CryptoCoins platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-primary-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary-green/10 rounded-full p-3">
                  <Users className="h-8 w-8 text-primary-green" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">{stats?.totalUsers || 0}</h3>
              <p className="text-text-gray mt-1">Total Users</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-profit hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-profit/10 rounded-full p-3">
                  <DollarSign className="h-8 w-8 text-profit" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">₹{stats?.totalDeposits?.toFixed(2) || '0.00'}</h3>
              <p className="text-text-gray mt-1">Total Deposits</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-success hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-success/10 rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">₹{stats?.totalInvestments?.toFixed(2) || '0.00'}</h3>
              <p className="text-text-gray mt-1">Total Investments</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark">{stats?.pendingTransactions || 0}</h3>
              <p className="text-text-gray mt-1">Pending Transactions</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin/users"
              className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Users className="h-10 w-10 mb-3" />
              <h3 className="text-xl font-bold mb-2">User Management</h3>
              <p className="text-white/80">Manage all users and their accounts</p>
            </Link>

            <Link
              to="/admin/coins"
              className="bg-white border-2 border-primary-green text-primary-green rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-primary-green/5 transition-all duration-300 hover:-translate-y-1"
            >
              <TrendingUp className="h-10 w-10 mb-3" />
              <h3 className="text-xl font-bold mb-2">Coin Management</h3>
              <p className="text-text-gray">Add and manage cryptocurrencies</p>
            </Link>

            <Link
              to="/admin/transactions"
              className="bg-white border-2 border-profit text-profit rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-green-50 transition-all duration-300 hover:-translate-y-1"
            >
              <DollarSign className="h-10 w-10 mb-3" />
              <h3 className="text-xl font-bold mb-2">Transactions</h3>
              <p className="text-text-gray">Review and approve transactions</p>
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-white border-2 border-yellow-500 text-yellow-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-yellow-50 transition-all duration-300 hover:-translate-y-1"
            >
              <BarChart3 className="h-10 w-10 mb-3" />
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-text-gray">View detailed reports and insights</p>
            </Link>

            <Link
              to="/admin/settings"
              className="bg-white border-2 border-text-gray text-text-gray rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-light-gray transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Settings</h3>
              <p className="text-text-gray">Configure platform settings</p>
            </Link>

            <Link
              to="/admin/support"
              className="bg-white border-2 border-blue-500 text-blue-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Customer Support</h3>
              <p className="text-text-gray">Manage user inquiries and help requests</p>
            </Link>

            <Link
              to="/admin/referrals"
              className="bg-white border-2 border-purple-500 text-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-purple-50 transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Referral Management</h3>
              <p className="text-text-gray">Approve referral bonuses and track referrals</p>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-dark mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-profit pl-4">
                <p className="text-text-gray text-sm mb-1">Total Profit Distributed</p>
                <p className="text-2xl font-bold text-profit">₹{stats?.totalProfitDistributed?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="border-l-4 border-primary-green pl-4">
                <p className="text-text-gray text-sm mb-1">Platform Revenue</p>
                <p className="text-2xl font-bold text-primary-green">₹{(stats?.totalDeposits - stats?.totalInvestments)?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
