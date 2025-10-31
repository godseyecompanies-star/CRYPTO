import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Gift, Users, Copy, Share2, CheckCircle2 } from 'lucide-react';

const Referrals = () => {
  const { user, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-green"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user || !user.referralCode) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-text-gray mb-4">Unable to load referral code. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-primary-green-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copyToClipboard = () => {
    if (!user?.referralCode) return;
    
    navigator.clipboard.writeText(user.referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy code. Please copy manually.');
    });
  };

  const shareReferral = () => {
    if (!user?.referralCode) return;
    
    const message = `🎁 Join CryptoCoins with my referral code and get ₹200 bonus!\n\nReferral Code: ${user.referralCode}\n\n📱 Register here: ${referralLink}\n\n💰 Start investing and earn weekly profits!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join CryptoCoins',
        text: message,
      });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 mb-4">
              <Gift className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">Refer & Earn</h1>
            <p className="text-text-gray">Invite friends and earn rewards together!</p>
          </div>

          {/* Referral Bonus Info */}
          {user?.referralBonus > 0 && !user?.referralBonusApproved && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <Gift className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="font-bold text-text-dark">Referral Bonus Pending</h3>
              </div>
              <p className="text-text-gray mb-3">
                You have <span className="font-bold text-primary-green">₹{user.referralBonus}</span> referral bonus waiting for admin approval!
              </p>
              {!user?.hasInvested && (
                <div className="bg-white/60 rounded-lg p-4 border border-yellow-400">
                  <p className="text-sm text-text-dark">
                    <strong>Note:</strong> To withdraw your referral bonus, you must invest in at least one coin first.
                  </p>
                </div>
              )}
            </div>
          )}

          {user?.referralBonusApproved && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-success rounded-xl p-6 mb-6">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-success mr-2" />
                <div>
                  <h3 className="font-bold text-text-dark">Bonus Approved!</h3>
                  <p className="text-text-gray">₹{user.referralBonus} has been added to your wallet</p>
                </div>
              </div>
            </div>
          )}

          {/* Your Referral Code Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-text-dark mb-6 text-center">Your Referral Code</h2>
            
            <div className="bg-gradient-to-r from-primary-green to-primary-green-dark rounded-xl p-6 text-center mb-6">
              <p className="text-white/80 text-sm mb-2">Share this code with friends</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-4xl font-bold text-white tracking-wider">{user?.referralCode}</p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-white text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
                >
                  {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                
                <button
                  onClick={shareReferral}
                  className="flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-text-dark mb-6">How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-green/10 rounded-full p-3 mr-4 flex-shrink-0">
                  <span className="text-primary-green font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-dark mb-1">Share Your Code</h3>
                  <p className="text-text-gray text-sm">Share your referral code with friends via WhatsApp, SMS, or social media</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-green/10 rounded-full p-3 mr-4 flex-shrink-0">
                  <span className="text-primary-green font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-dark mb-1">Friend Registers</h3>
                  <p className="text-text-gray text-sm">Your friend signs up using your referral code</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-green/10 rounded-full p-3 mr-4 flex-shrink-0">
                  <span className="text-primary-green font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-dark mb-1">Get ₹200 Bonus</h3>
                  <p className="text-text-gray text-sm">Your friend gets ₹200 bonus after admin approval</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-green/10 rounded-full p-3 mr-4 flex-shrink-0">
                  <span className="text-primary-green font-bold text-lg">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-dark mb-1">Invest to Withdraw</h3>
                  <p className="text-text-gray text-sm">Your friend must invest in at least one coin to withdraw the bonus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Total Referrals</h2>
            <p className="text-5xl font-extrabold mb-4">{user?.referrals?.length || 0}</p>
            <p className="text-white/80">friends joined using your code</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Referrals;
