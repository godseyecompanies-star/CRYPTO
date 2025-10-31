import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { transactionAPI, userAPI } from '../services/api';
import { Wallet, ArrowDownCircle, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [bankCharges, setBankCharges] = useState(0);
  const [amountToReceive, setAmountToReceive] = useState(0);

  const MIN_BALANCE = 200;
  const BANK_CHARGE_PERCENT = 2;

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const charges = (parseFloat(amount) * BANK_CHARGE_PERCENT) / 100;
      const receive = parseFloat(amount) - charges;
      setBankCharges(charges);
      setAmountToReceive(receive);
    } else {
      setBankCharges(0);
      setAmountToReceive(0);
    }
  }, [amount]);

  const fetchWalletBalance = async () => {
    try {
      const response = await userAPI.getWallet();
      setWalletBalance(response.data.walletBalance || 0);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await userAPI.getTransactions();
      const withdrawals = response.data.filter(t => t.type === 'withdrawal');
      setTransactions(withdrawals);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    const totalRequired = withdrawAmount + MIN_BALANCE;

    if (walletBalance < totalRequired) {
      setError(`Insufficient balance! You need ₹${totalRequired} (₹${withdrawAmount} withdrawal + ₹${MIN_BALANCE} minimum balance). Available: ₹${walletBalance}`);
      return;
    }

    if (!accountNumber || !ifscCode || !accountHolderName) {
      setError('Please fill in all bank account details');
      return;
    }

    setLoading(true);

    try {
      const response = await transactionAPI.createWithdrawal({
        amount: withdrawAmount,
        accountNumber,
        ifscCode,
        accountHolderName,
      });

      setSuccess(`Withdrawal request submitted! You will receive ₹${response.data.amountAfterCharges} after ₹${response.data.bankCharges} bank charges.`);
      setAmount('');
      setAccountNumber('');
      setIfscCode('');
      setAccountHolderName('');
      fetchWalletBalance();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const availableToWithdraw = Math.max(0, walletBalance - MIN_BALANCE);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">Withdraw Money</h1>

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-primary-green to-primary-green-dark rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold">₹{walletBalance.toFixed(2)}</h2>
                <p className="text-white/70 text-sm mt-2">
                  Available to withdraw: ₹{availableToWithdraw.toFixed(2)}
                </p>
              </div>
              <Wallet className="h-16 w-16 text-white/30" />
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-text-dark mb-2">Important Information:</h3>
                <ul className="list-disc list-inside space-y-1 text-text-gray text-sm">
                  <li>Minimum balance of ₹{MIN_BALANCE} must be maintained in your wallet</li>
                  <li>{BANK_CHARGE_PERCENT}% bank charges will be deducted from withdrawal amount</li>
                  <li>Withdrawal requests are processed within 24-48 hours</li>
                  <li>Amount will be transferred to your provided bank account</li>
                </ul>
              </div>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <ArrowDownCircle className="h-6 w-6 text-primary-green" />
              <h2 className="text-2xl font-bold text-text-dark">Withdrawal Request</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  max={availableToWithdraw}
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder={`Enter amount (Max: ₹${availableToWithdraw.toFixed(2)})`}
                />
              </div>

              {/* Calculation Display */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-light-gray rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Withdrawal Amount:</span>
                    <span className="font-semibold text-text-dark">₹{parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Bank Charges (2%):</span>
                    <span className="font-semibold text-red-600">- ₹{bankCharges.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border-gray pt-2 mt-2"></div>
                  <div className="flex justify-between">
                    <span className="font-bold text-text-dark">You will receive:</span>
                    <span className="font-bold text-primary-green text-lg">₹{amountToReceive.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="border-t border-border-gray pt-6">
                <h3 className="font-semibold text-text-dark mb-4">Bank Account Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                      placeholder="Enter account holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                      placeholder="Enter account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      required
                      className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || availableToWithdraw <= 0}
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Withdrawal History</h2>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border border-border-gray rounded-lg hover:bg-light-gray transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.status === 'approved' ? 'bg-success/10' :
                        transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {transaction.status === 'approved' && <CheckCircle className="h-6 w-6 text-success" />}
                        {transaction.status === 'pending' && <Clock className="h-6 w-6 text-yellow-600" />}
                        {transaction.status === 'rejected' && <XCircle className="h-6 w-6 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-text-dark">₹{transaction.amount?.toFixed(2)}</p>
                        <p className="text-sm text-text-gray">{new Date(transaction.createdAt).toLocaleString()}</p>
                        {transaction.adminNotes && transaction.status === 'pending' && (
                          <p className="text-xs text-text-gray mt-1">Processing...</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      transaction.status === 'approved' ? 'bg-success/10 text-success border border-success' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-400' :
                      'bg-red-100 text-red-600 border border-red-400'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-gray py-8">No withdrawal requests yet</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Withdraw;
