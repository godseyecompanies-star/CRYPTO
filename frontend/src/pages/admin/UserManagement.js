import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import { Search, UserCheck, UserX, Wallet, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletAction, setWalletAction] = useState('add');
  const [walletAmount, setWalletAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!walletAmount || parseFloat(walletAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await adminAPI.updateUserWallet(selectedUser._id, {
        amount: parseFloat(walletAmount),
        action: walletAction,
      });
      setSuccess(`Successfully ${walletAction === 'add' ? 'added' : 'deducted'} ₹${walletAmount}`);
      setSelectedUser(null);
      setWalletAmount('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update wallet');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
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
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-4 md:mb-0">User Management</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-gray" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
              />
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg">
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-primary-green">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">User</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Wallet</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Invested</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Profit</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-text-dark">{user.fullName}</p>
                          <p className="text-sm text-text-gray">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-dark">{user.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-green">₹{user.walletBalance?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-text-dark">₹{user.totalInvested?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-profit">₹{user.totalProfit?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? 'bg-success/10 text-success border border-success'
                            : 'bg-red-100 text-red-600 border border-red-400'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 bg-primary-green/10 text-primary-green rounded-lg hover:bg-primary-green hover:text-white transition-all"
                            title="Manage Wallet"
                          >
                            <Wallet className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                            className={`p-2 rounded-lg transition-all ${
                              user.isActive
                                ? 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                                : 'bg-success/10 text-success hover:bg-success hover:text-white'
                            }`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-gray">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setSelectedUser(null);
                setWalletAmount('');
                setError('');
              }}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-2 pb-4 border-b-2 border-primary-green">
              Manage Wallet
            </h2>

            <div className="my-6">
              <p className="text-text-gray text-sm">User</p>
              <p className="font-bold text-text-dark text-lg">{selectedUser.fullName}</p>
              <p className="text-text-gray text-sm mt-2">Current Balance</p>
              <p className="font-bold text-primary-green text-2xl">₹{selectedUser.walletBalance?.toFixed(2)}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleWalletUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Action</label>
                <select
                  value={walletAction}
                  onChange={(e) => setWalletAction(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                >
                  <option value="add">Add Money</option>
                  <option value="deduct">Deduct Money</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Enter amount"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Update Wallet
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
