import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { supportAPI } from '../../services/api';
import { MessageCircle, Eye, X, CheckCircle2, Clock, Key, Send } from 'lucide-react';

const SupportManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [filterStatus, filterPriority]);

  const fetchMessages = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      
      const response = await supportAPI.getAllMessages(params);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMessage = async (id, status, response) => {
    try {
      const data = { status };
      if (response) data.adminResponse = response;
      
      await supportAPI.updateMessage(id, data);
      setSelectedMessage(null);
      setAdminResponse('');
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      alert(error.response?.data?.message || 'Failed to update message');
    }
  };

  const handleGenerateCode = async () => {
    if (!phoneNumber) {
      alert('Please enter phone number');
      return;
    }

    try {
      const response = await supportAPI.generateResetCode({ phoneNumber });
      setGeneratedCode(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate code');
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-4 md:mb-0">Support Management</h1>
            
            <button
              onClick={() => setShowCodeGenerator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Key className="h-5 w-5" />
              <span>Generate Reset Code</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Filter by Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-gray">
                <thead className="bg-light-gray">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-gray">
                  {messages.map((message) => (
                    <tr key={message._id} className="hover:bg-light-gray transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-text-dark">{message.userId?.fullName}</div>
                          <div className="text-sm text-text-gray">{message.userId?.phoneNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-dark font-medium">{message.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-gray capitalize">{message.category.replace('-', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(message.status)}`}>
                          <Clock className="h-3 w-3" />
                          <span>{message.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedMessage(message);
                            setAdminResponse(message.adminResponse || '');
                          }}
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

            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-text-gray mx-auto mb-4 opacity-50" />
                <p className="text-text-gray">No support messages found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedMessage(null);
                setAdminResponse('');
              }}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-6 pb-4 border-b-2 border-primary-green">
              Support Message Details
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-gray">User</p>
                  <p className="font-semibold text-text-dark">{selectedMessage.userId?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-text-gray">Phone</p>
                  <p className="font-semibold text-text-dark">{selectedMessage.userId?.phoneNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-gray">Category</p>
                  <p className="font-semibold text-text-dark capitalize">{selectedMessage.category.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-text-gray">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-gray mb-1">Subject</p>
                <p className="font-bold text-text-dark text-lg">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-sm text-text-gray mb-1">Message</p>
                <div className="bg-light-gray rounded-lg p-4">
                  <p className="text-text-dark">{selectedMessage.message}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-gray">Date</p>
                <p className="font-semibold text-text-dark">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Admin Response</label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                  placeholder="Type your response here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateMessage(selectedMessage._id, 'in-progress', adminResponse)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateMessage(selectedMessage._id, 'resolved', adminResponse)}
                    className="px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-all"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleUpdateMessage(selectedMessage._id, 'closed', adminResponse)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleUpdateMessage(selectedMessage._id, selectedMessage.status, adminResponse)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Send className="h-5 w-5" />
              <span>Send Response</span>
            </button>
          </div>
        </div>
      )}

      {/* Code Generator Modal */}
      {showCodeGenerator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowCodeGenerator(false);
                setPhoneNumber('');
                setGeneratedCode(null);
              }}
              className="absolute top-4 right-4 text-text-gray hover:text-primary-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-purple-100 rounded-full p-4 inline-block mb-4">
                <Key className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-text-dark">Generate Reset Code</h2>
              <p className="text-text-gray text-sm mt-2">Create a password reset code for users who forgot their password</p>
            </div>

            {!generatedCode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">User Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border-gray rounded-lg focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/10 transition-all"
                    placeholder="+919999999999"
                  />
                </div>

                <button
                  onClick={handleGenerateCode}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Generate Code
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-success rounded-lg p-6">
                  <p className="text-sm text-text-gray mb-2">User Details:</p>
                  <p className="font-semibold text-text-dark">{generatedCode.user.fullName}</p>
                  <p className="text-text-gray text-sm">{generatedCode.user.phoneNumber}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 rounded-lg p-6 text-center">
                  <p className="text-sm text-text-gray mb-2">Reset Code:</p>
                  <p className="text-4xl font-bold text-purple-600 tracking-wider">{generatedCode.resetCode}</p>
                  <p className="text-xs text-text-gray mt-2">Expires in: {generatedCode.expiresIn}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                  <p className="text-sm text-text-gray">{generatedCode.note}</p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode.resetCode);
                    alert('Code copied to clipboard!');
                  }}
                  className="w-full bg-gradient-to-r from-primary-green to-primary-green-dark text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Copy Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportManagement;
