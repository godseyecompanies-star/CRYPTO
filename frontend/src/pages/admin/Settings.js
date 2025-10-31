import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI, authAPI } from '../../services/api';
import { QrCode, Upload, CheckCircle, Lock } from 'lucide-react';

const Settings = () => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [currentQrCode, setCurrentQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('📥 Fetching settings from server...');
      const response = await adminAPI.getSettings();
      console.log('📋 Full settings response:', JSON.stringify(response.data, null, 2));
      console.log('🖼️ QR Code Image Path:', response.data.qrCodeImage);
      
      if (response.data.qrCodeImage) {
        // Use API URL from environment and add timestamp to prevent caching
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const BASE_URL = API_BASE.replace('/api', '');
        const qrUrl = `${BASE_URL}/${response.data.qrCodeImage}?t=${Date.now()}`;
        console.log('✅ Setting QR URL to:', qrUrl);
        setCurrentQrCode(qrUrl);
      } else {
        console.warn('⚠️ No QR code image found in settings!');
        console.warn('⚠️ Response data:', response.data);
        setCurrentQrCode('');
      }
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
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
      setQrCodeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!qrCodeFile) {
      setError('Please select a QR code image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('qrCode', qrCodeFile);
      
      console.log('📤 Uploading QR code...', {
        fileName: qrCodeFile.name,
        fileSize: qrCodeFile.size,
        fileType: qrCodeFile.type
      });
      
      const response = await adminAPI.updateSettings(formData);
      console.log('✅ Upload successful:', response.data);
      console.log('✅ QR Path from server:', response.data.qrCodeImage);
      
      setSuccess(`QR code updated successfully! Reloading page...`);
      setQrCodeFile(null);
      
      // Force immediate hard reload to clear all cache
      setTimeout(() => {
        console.log('🔄 Force reloading page...');
        window.location.reload(true); // true = hard reload from server
      }, 1000);
    } catch (err) {
      console.error('❌ Upload error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || err.message || 'Failed to update QR code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-dark mb-8">Platform Settings</h1>

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

          {/* QR Code Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <QrCode className="h-6 w-6 text-primary-green" />
              <h2 className="text-2xl font-bold text-text-dark">Payment QR Code</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current QR Code */}
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-4">Current QR Code</h3>
                {currentQrCode ? (
                  <div className="border-4 border-primary-green rounded-xl p-4 bg-white">
                    <img
                      key={currentQrCode}
                      src={currentQrCode}
                      alt="Current QR Code"
                      className="w-full h-auto object-contain"
                      onLoad={() => {
                        console.log('✅ QR code loaded successfully!');
                      }}
                      onError={(e) => {
                        console.error('❌ Failed to load QR code from:', currentQrCode);
                        console.error('❌ Image error event:', e);
                        // Don't clear immediately - let user see the error
                        setTimeout(() => {
                          console.warn('⚠️ Retrying QR code load...');
                          // Try one more time with fresh timestamp
                          const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                          const BASE_URL = API_BASE.replace('/api', '');
                          setCurrentQrCode(`${BASE_URL}/uploads/payment-qr-code.png?retry=${Date.now()}`);
                        }, 2000);
                      }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-gray rounded-xl p-8 text-center bg-light-gray">
                    <QrCode className="h-16 w-16 text-text-gray mx-auto mb-2" />
                    <p className="text-text-gray">No QR code uploaded yet</p>
                    <p className="text-text-gray text-sm mt-2">Upload your first QR code below</p>
                  </div>
                )}
              </div>

              {/* Upload New QR Code */}
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-4">Upload New QR Code</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-border-gray rounded-xl p-6 text-center hover:border-primary-green transition-all">
                    <Upload className="h-12 w-12 text-text-gray mx-auto mb-2" />
                    <input
                      type="file"
                      id="qrFileInput"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="qrFileInput"
                      className="cursor-pointer text-primary-green font-semibold hover:underline"
                    >
                      Click to upload
                    </label>
                    <p className="text-text-gray text-sm mt-1">PNG, JPG up to 5MB</p>
                    {qrCodeFile && (
                      <p className="text-success text-sm mt-2 font-medium">✓ {qrCodeFile.name}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !qrCodeFile}
                    className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Uploading...' : 'Upload QR Code'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-primary-green" />
              <h2 className="text-2xl font-bold text-text-dark">Change Password</h2>
            </div>

            {passwordSuccess && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-success text-success rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-primary-green rounded-xl p-6">
            <h3 className="font-bold text-text-dark mb-2">📌 Important Information</h3>
            <ul className="list-disc list-inside space-y-1 text-text-gray text-sm">
              <li>This QR code will be displayed to users on the "Add Money" page</li>
              <li>Users will scan this code to make PayTM/UPI deposits</li>
              <li>Ensure the QR code is clear and scannable</li>
              <li>The QR code should link to your business PayTM/UPI account</li>
              <li>Keep your admin password secure and change it regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
