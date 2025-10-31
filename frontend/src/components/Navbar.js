import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Coins, Menu, X, HeadphonesIcon, FileText } from 'lucide-react';
import SupportModal from './SupportModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [supportModalOpen, setSupportModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white border-b-2 border-primary-green shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-primary-green" />
            <span className="text-2xl font-extrabold text-primary-green">CryptoCoins</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* T&C Link - Always Visible */}
            <Link
              to="/terms"
              className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all duration-300 hover:-translate-y-0.5 border border-amber-300"
              title="Terms & Conditions"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">T&C</span>
            </Link>
            
            {user && (
              <>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => setSupportModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 hover:-translate-y-0.5"
                    title="Customer Support"
                  >
                    <HeadphonesIcon className="h-5 w-5" />
                    <span>Support</span>
                  </button>
                )}
                <div className="flex items-center space-x-2 px-4 py-2 bg-light-gray rounded-lg">
                  <User className="h-5 w-5 text-text-gray" />
                  <span className="text-sm font-medium text-text-dark">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-light transition-all duration-300 hover:-translate-y-0.5"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-dark hover:bg-light-gray"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {/* T&C Link - Mobile */}
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-300"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Terms & Conditions</span>
            </Link>
            
            {user && (
              <>
                <div className="px-4 py-2 bg-light-gray rounded-lg">
                  <p className="text-sm font-medium text-text-dark">{user.fullName}</p>
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => {
                      setSupportModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                  >
                    <HeadphonesIcon className="h-5 w-5" />
                    <span>Customer Support</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-green text-white rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Support Modal */}
      {user && user.role !== 'admin' && (
        <SupportModal 
          isOpen={supportModalOpen} 
          onClose={() => setSupportModalOpen(false)} 
        />
      )}
    </nav>
    </>
  );
};

export default Navbar;
