import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { referralAPI } from '../../services/api';
import { Users, Gift, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

const ReferralManagement = () => {
  const [referralUsers, setReferralUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        referralAPI.getReferralUsers(),
        referralAPI.getReferralStats(),
      ]);
      setReferralUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this referral bonus?')) {
      return;
    }

    try {
      await referralAPI.approveReferralBonus(userId);
      alert('Referral bonus approved successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve bonus');
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
          <h1 className="text-3xl font-bold text-text-dark mb-8">Referral Management</h1>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-text-gray text-sm mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-text-dark">{stats.totalReferrals}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-text-gray text-sm mb-1">Pending Bonuses</p>
                <p className="text-3xl font-bold text-text-dark">{stats.pendingBonuses}</p>
                <p className="text-sm text-text-gray mt-1">₹{stats.totalBonusPending}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-success/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>
                <p className="text-text-gray text-sm mb-1">Approved Bonuses</p>
                <p className="text-3xl font-bold text-text-dark">{stats.approvedBonuses}</p>
                <p className="text-sm text-text-gray mt-1">₹{stats.totalBonusPaid}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-text-gray text-sm mb-1">Total Paid Out</p>
                <p className="text-3xl font-bold text-text-dark">₹{stats.totalBonusPaid}</p>
              </div>
            </div>
          )}

          {/* Pending Referral Bonuses Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border-gray">
              <h2 className="text-xl font-bold text-text-dark">Pending Referral Bonuses</h2>
              <p className="text-text-gray text-sm mt-1">Approve referral bonuses for users who joined with a referral code</p>
            </div>

            {referralUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-gray">
                  <thead className="bg-light-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Referred By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Bonus Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Has Invested</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Joined Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-gray">
                    {referralUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-light-gray transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text-dark">{user.fullName}</div>
                            <div className="text-sm text-text-gray">{user.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.referredBy ? (
                            <div>
                              <div className="text-sm font-medium text-text-dark">{user.referredBy.fullName}</div>
                              <div className="text-sm text-text-gray">{user.referredBy.phoneNumber}</div>
                              <div className="text-xs text-primary-green font-semibold">{user.referredBy.referralCode}</div>
                            </div>
                          ) : (
                            <span className="text-text-gray">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                            ₹{user.referralBonus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.hasInvested ? (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Yes</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-400">
                              <XCircle className="h-3 w-3" />
                              <span>No</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-green to-primary-green-dark text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Approve ₹{user.referralBonus}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-text-gray mx-auto mb-4 opacity-50" />
                <p className="text-text-gray">No pending referral bonuses</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="font-bold text-text-dark mb-2">📌 Important Notes:</h3>
            <ul className="list-disc list-inside space-y-2 text-text-gray text-sm">
              <li>Users receive ₹200 bonus when they register with a referral code</li>
              <li>The bonus appears as "Pending" until you approve it here</li>
              <li>Once approved, the bonus amount is added to the user's wallet</li>
              <li>Users cannot withdraw referral bonus until they invest in at least one coin</li>
              <li>Check "Has Invested" column to verify user eligibility</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralManagement;
