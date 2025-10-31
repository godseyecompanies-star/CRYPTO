import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userAPI } from '../services/api';
import { CheckCircle, Clock, XCircle, Filter } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filterType, filterStatus]);

  const fetchTransactions = async () => {
    try {
      const response = await userAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTransactions(filtered);
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
          <h1 className="text-3xl font-bold text-text-dark mb-8">Transaction History</h1>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="h-5 w-5 text-text-gray" />
              <h3 className="text-lg font-semibold text-text-dark">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Transaction Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="investment">Investment</option>
                  <option value="profit">Profit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-dark mb-6">
              All Transactions ({filteredTransactions.length})
            </h2>

            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border-gray rounded-lg hover:bg-light-gray transition-all"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className={`p-3 rounded-full ${
                        transaction.status === 'approved' ? 'bg-success/10' :
                        transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {transaction.status === 'approved' && <CheckCircle className="h-6 w-6 text-success" />}
                        {transaction.status === 'pending' && <Clock className="h-6 w-6 text-yellow-600" />}
                        {transaction.status === 'rejected' && <XCircle className="h-6 w-6 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-text-dark capitalize">{transaction.type}</p>
                        <p className="text-sm text-text-gray">{new Date(transaction.createdAt).toLocaleString()}</p>
                        {transaction.coinId && (
                          <p className="text-sm text-primary-green font-medium mt-1">
                            {transaction.coinId.name || 'Coin'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end space-x-6">
                      <div className="text-right">
                        <p className="font-bold text-xl text-text-dark">₹{transaction.amount?.toFixed(2)}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                        transaction.status === 'approved' ? 'bg-success/10 text-success border border-success' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-400' :
                        'bg-red-100 text-red-600 border border-red-400'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-text-gray" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2">No Transactions Found</h3>
                <p className="text-text-gray">Try adjusting your filters or make your first transaction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
