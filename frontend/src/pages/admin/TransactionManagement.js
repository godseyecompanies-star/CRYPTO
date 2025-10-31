import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, activeTab]);

  const fetchTransactions = async () => {
    try {
      const response = await adminAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (activeTab === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === activeTab));
    }
  };

  const handleUpdateTransaction = async (transactionId, status) => {
    setError('');
    setSuccess('');

    try {
      await adminAPI.updateTransaction(transactionId, { status, adminNotes });
      setSuccess(`Transaction ${status} successfully`);
      setSelectedTransaction(null);
      setAdminNotes('');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update transaction');
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

  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">Transaction Management</h1>

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

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
            <div className="flex border-b border-border-gray">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border-b-4 border-yellow-500'
                    : 'text-text-gray hover:bg-light-gray'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'approved'
                    ? 'bg-green-50 text-success border-b-4 border-success'
                    : 'text-text-gray hover:bg-light-gray'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'rejected'
                    ? 'bg-red-50 text-red-600 border-b-4 border-red-500'
                    : 'text-text-gray hover:bg-light-gray'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary-green/10 text-primary-green border-b-4 border-primary-green'
                    : 'text-text-gray hover:bg-light-gray'
                }`}
              >
                All ({transactions.length})
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-primary-green">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">User</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-text-dark">{transaction.userId?.fullName}</p>
                          <p className="text-sm text-text-gray">{transaction.userId?.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium text-text-dark">{transaction.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-green">₹{transaction.amount?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-gray">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === 'approved'
                            ? 'bg-success/10 text-success border border-success'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                            : 'bg-red-100 text-red-600 border border-red-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-2 bg-primary-green/10 text-primary-green rounded-lg hover:bg-primary-green hover:text-white transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-gray">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedTransaction(null);
                setAdminNotes('');
              }}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-6 pb-4 border-b-2 border-primary-green">
              Transaction Details
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-gray">User</p>
                  <p className="font-semibold text-text-dark">{selectedTransaction.userId?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-text-gray">Phone</p>
                  <p className="font-semibold text-text-dark">{selectedTransaction.userId?.phoneNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-gray">Type</p>
                  <p className="font-semibold text-text-dark capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-sm text-text-gray">Amount</p>
                  <p className="font-bold text-2xl text-primary-green">₹{selectedTransaction.amount?.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-gray">Date</p>
                <p className="font-semibold text-text-dark">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-text-gray">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedTransaction.status === 'approved'
                    ? 'bg-success/10 text-success border border-success'
                    : selectedTransaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                    : 'bg-red-100 text-red-600 border border-red-400'
                }`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>

              {selectedTransaction.paymentProof && (
                <div>
                  <p className="text-sm text-text-gray mb-2">Payment Proof</p>
                  <img
                    src={`http://localhost:5000/${selectedTransaction.paymentProof}`}
                    alt="Payment Proof"
                    className="max-w-full h-auto rounded-lg border-2 border-border-gray"
                  />
                </div>
              )}

              {/* Bank Account Details for Withdrawals */}
              {selectedTransaction.type === 'withdrawal' && selectedTransaction.adminNotes && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6">
                  <h3 className="font-bold text-text-dark mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Account Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedTransaction.adminNotes.split(' | ').map((detail, index) => {
                      const [label, value] = detail.split(': ');
                      if (label && value) {
                        return (
                          <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                            <span className="text-text-gray font-medium">{label}</span>
                            <span className="text-text-dark font-bold">{value}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {selectedTransaction.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Admin Notes (Optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                    placeholder="Add notes..."
                  />
                </div>
              )}
            </div>

            {selectedTransaction.status === 'pending' && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdateTransaction(selectedTransaction._id, 'approved')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-success text-white py-3 rounded-lg font-semibold hover:bg-success/90 transition-all"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleUpdateTransaction(selectedTransaction._id, 'rejected')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionManagement;
