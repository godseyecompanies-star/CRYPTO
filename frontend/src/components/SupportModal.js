import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import { X, Send, MessageCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const SupportModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [userMessages, setUserMessages] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserMessages();
    }
  }, [isOpen]);

  const fetchUserMessages = async () => {
    try {
      const response = await supportAPI.getUserMessages();
      setUserMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await supportAPI.createMessage({
        subject,
        message,
        category,
        priority,
      });

      setSuccess('Your message has been sent! Our team will respond soon.');
      setSubject('');
      setMessage('');
      setCategory('other');
      setPriority('medium');
      
      // Refresh messages
      fetchUserMessages();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-progress':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <XCircle className="h-4 w-4 text-text-gray" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'resolved':
      case 'closed':
        return 'bg-success/10 text-success border-success';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-3">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Customer Support</h2>
              <p className="text-blue-100 text-sm">We're here to help you!</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-gray">
          <button
            onClick={() => setShowHistory(false)}
            className={`flex-1 py-3 px-4 font-semibold transition-all ${
              !showHistory
                ? 'text-primary-green border-b-2 border-primary-green'
                : 'text-text-gray hover:text-primary-green'
            }`}
          >
            New Message
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`flex-1 py-3 px-4 font-semibold transition-all ${
              showHistory
                ? 'text-primary-green border-b-2 border-primary-green'
                : 'text-text-gray hover:text-primary-green'
            }`}
          >
            My Messages ({userMessages.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showHistory ? (
            /* New Message Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && (
                <div className="p-4 bg-green-100 border-l-4 border-success text-success rounded-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  {success}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                >
                  <option value="password-reset">Password Reset</option>
                  <option value="transaction">Transaction Issue</option>
                  <option value="investment">Investment Help</option>
                  <option value="withdrawal">Withdrawal Issue</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all resize-none"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          ) : (
            /* Message History */
            <div className="space-y-4">
              {userMessages.length > 0 ? (
                userMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="border-2 border-border-gray rounded-xl p-4 hover:border-primary-green transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-dark">{msg.subject}</h3>
                        <p className="text-sm text-text-gray capitalize">Category: {msg.category.replace('-', ' ')}</p>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(msg.status)}`}>
                        {getStatusIcon(msg.status)}
                        <span className="capitalize">{msg.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-text-gray text-sm mb-3">{msg.message}</p>
                    
                    {msg.adminResponse && (
                      <div className="bg-green-50 border-l-4 border-success rounded p-3 mt-3">
                        <p className="text-xs text-text-gray mb-1">Admin Response:</p>
                        <p className="text-sm text-text-dark">{msg.adminResponse}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-text-gray mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-text-gray mx-auto mb-4 opacity-50" />
                  <p className="text-text-gray">No messages yet</p>
                  <p className="text-sm text-text-gray mt-1">Send your first message to get help!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
