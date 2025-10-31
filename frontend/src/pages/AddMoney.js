import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { transactionAPI, userAPI } from '../services/api';
import { QrCode, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchQRCode();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await userAPI.getTransactions();
      const deposits = response.data.filter(t => t.type === 'deposit');
      setTransactions(deposits);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchQRCode = async () => {
    try {
      const response = await userAPI.getSettings();
      if (response.data.qrCodeImage) {
        // Use API URL from environment and add timestamp to prevent caching
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const BASE_URL = API_BASE.replace('/api', '');
        const qrUrl = `${BASE_URL}/${response.data.qrCodeImage}?t=${Date.now()}`;
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setPaymentProof(file);
      setError('');
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

    if (!paymentProof) {
      setError('Please upload payment proof');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('paymentProof', paymentProof);

      await transactionAPI.createDeposit(formData);
      setSuccess('Deposit request submitted successfully! Awaiting admin approval.');
      setAmount('');
      setPaymentProof(null);
      document.getElementById('fileInput').value = '';
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit deposit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">Add Money</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-primary-green p-4 rounded-lg mb-6">
              <h3 className="font-bold text-text-dark mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-text-gray text-sm">
                <li>Scan the QR code below using your PayTM/UPI app</li>
                <li>Send the desired amount</li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>Upload the screenshot and enter the amount below</li>
                <li>Wait for admin approval</li>
              </ol>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-8">
              <div className="border-4 border-primary-green rounded-xl p-6 bg-white shadow-xl">
                {qrCodeUrl ? (
                  <img
                    key={qrCodeUrl}
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      console.error('Error loading QR code');
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 flex flex-col items-center justify-center bg-light-gray rounded-lg">
                    <QrCode className="h-16 w-16 text-text-gray mb-2" />
                    <p className="text-text-gray text-sm">QR Code not available</p>
                    <p className="text-text-gray text-xs">Contact admin</p>
                  </div>
                )}
              </div>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Upload Payment Screenshot</label>
                <div className="border-2 border-dashed border-border-gray rounded-lg p-6 text-center hover:border-primary-green transition-all">
                  <Upload className="h-12 w-12 text-text-gray mx-auto mb-2" />
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer text-primary-green font-semibold hover:underline"
                  >
                    Click to upload
                  </label>
                  <p className="text-text-gray text-sm mt-1">PNG, JPG up to 5MB</p>
                  {paymentProof && (
                    <p className="text-success text-sm mt-2 font-medium">✓ {paymentProof.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </form>
          </div>

          {/* Pending Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Your Deposit Requests</h2>
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
              <p className="text-center text-text-gray py-8">No deposit requests yet</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddMoney;
