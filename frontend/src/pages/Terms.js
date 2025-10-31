import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, FileText, Info } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="h-16 w-16 text-primary-green mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-text-dark mb-2">Terms & Conditions</h1>
          <p className="text-text-gray">Please read these terms carefully before using CryptoCoins</p>
        </div>

        {/* Market Risk Warning - Prominent */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-red-900 mb-3">⚠️ Market Risk Disclaimer</h2>
              <div className="space-y-2 text-red-800">
                <p className="font-semibold">
                  Investing in cryptocurrencies and digital assets is subject to high market risks.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Cryptocurrency prices are highly volatile and can fluctuate significantly</li>
                  <li>Past performance is not indicative of future results</li>
                  <li>You may lose some or all of your invested capital</li>
                  <li>Market conditions can change rapidly without warning</li>
                  <li>No investment is guaranteed or risk-free</li>
                  <li>Only invest what you can afford to lose</li>
                </ul>
                <p className="font-semibold mt-3">
                  Please carefully consider your financial situation and risk tolerance before investing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-green" />
              1. Acceptance of Terms
            </h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>
                By accessing and using CryptoCoins platform ("the Platform"), you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p>
                If you do not agree with any part of these terms, you must not use the Platform.
              </p>
            </div>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">2. Eligibility</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>You must meet the following criteria to use this Platform:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using the Platform under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>
            </div>
          </section>

          {/* 3. Investment Risks */}
          <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text-dark mb-4">3. Investment Risks</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p className="font-semibold text-yellow-900">
                CRYPTOCURRENCY INVESTMENTS CARRY SUBSTANTIAL RISK:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>High Volatility:</strong> Prices can change dramatically in short periods</li>
                <li><strong>Market Manipulation:</strong> Cryptocurrency markets may be subject to manipulation</li>
                <li><strong>Liquidity Risk:</strong> You may not be able to sell your assets when desired</li>
                <li><strong>Regulatory Risk:</strong> Government regulations may change and affect your investments</li>
                <li><strong>Technology Risk:</strong> Technical failures or security breaches may occur</li>
                <li><strong>Loss of Capital:</strong> You may lose your entire investment</li>
              </ul>
              <p className="font-semibold text-yellow-900 mt-3">
                By using this Platform, you acknowledge and accept these risks.
              </p>
            </div>
          </section>

          {/* 4. Account Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">4. Account Responsibilities</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring the security of your mobile device and email</li>
                <li>Providing accurate and up-to-date information</li>
              </ul>
            </div>
          </section>

          {/* 5. Deposits and Withdrawals */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">5. Deposits and Withdrawals</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Minimum balance of ₹200 must be maintained in your wallet</li>
                <li>Withdrawal requests are subject to verification and approval</li>
                <li>Bank charges of 2% apply to all withdrawals</li>
                <li>Referral bonuses cannot be withdrawn until you make an investment</li>
                <li>Processing times may vary depending on verification requirements</li>
                <li>We reserve the right to reject suspicious transactions</li>
              </ul>
            </div>
          </section>

          {/* 6. Referral Program */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">6. Referral Program</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Referral bonuses are subject to admin approval</li>
                <li>You must make at least one investment to withdraw referral bonuses</li>
                <li>Referral codes cannot be transferred or sold</li>
                <li>We reserve the right to void bonuses obtained through fraudulent means</li>
                <li>Abuse of the referral system may result in account suspension</li>
              </ul>
            </div>
          </section>

          {/* 7. Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">7. Prohibited Activities</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the Platform for any illegal purposes</li>
                <li>Attempt to manipulate prices or markets</li>
                <li>Create multiple accounts to abuse referral bonuses</li>
                <li>Share your account credentials with others</li>
                <li>Reverse engineer or hack the Platform</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          {/* 8. No Investment Advice */}
          <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text-dark mb-4">8. No Investment Advice</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p className="font-semibold text-blue-900">
                The Platform does NOT provide financial, investment, or legal advice.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All information is for informational purposes only</li>
                <li>We do not recommend any specific investments</li>
                <li>You should consult with qualified professionals before investing</li>
                <li>We are not responsible for your investment decisions</li>
              </ul>
            </div>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">9. Limitation of Liability</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We are not liable for any investment losses</li>
                <li>We are not responsible for market fluctuations</li>
                <li>We are not liable for technical failures or interruptions</li>
                <li>We are not responsible for third-party actions</li>
                <li>Our total liability is limited to the amount of fees you paid</li>
              </ul>
            </div>
          </section>

          {/* 10. Account Suspension */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">10. Account Suspension and Termination</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>We may suspend or terminate your account if:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You violate these Terms and Conditions</li>
                <li>We suspect fraudulent activity</li>
                <li>Required by law or regulatory authorities</li>
                <li>You engage in prohibited activities</li>
              </ul>
            </div>
          </section>

          {/* 11. Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">11. Changes to Terms</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>
                We reserve the right to modify these Terms and Conditions at any time.
                Continued use of the Platform after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">12. Governing Law</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>
                These Terms and Conditions are governed by the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of courts in India.
              </p>
            </div>
          </section>

          {/* 13. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-4">13. Contact Information</h2>
            <div className="text-text-gray space-y-2 text-sm">
              <p>
                For questions about these Terms and Conditions, please contact us through
                the customer support section of the Platform.
              </p>
            </div>
          </section>

          {/* Final Warning */}
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mt-8">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
              <div className="text-sm text-red-900">
                <p className="font-bold mb-2">IMPORTANT REMINDER:</p>
                <p>
                  Cryptocurrency investments are highly speculative and involve substantial risk of loss.
                  Only invest money that you can afford to lose completely. Always do your own research
                  and consider seeking advice from qualified financial advisors.
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-text-gray pt-6 border-t border-border-gray">
            <p>Last Updated: January 27, 2025</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-primary-green-dark transition-colors shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
