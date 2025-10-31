import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Coins, PlusCircle, ArrowDownCircle } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/coins', icon: Coins, label: 'Coins' },
    { path: '/add-money', icon: PlusCircle, label: 'Add Money' },
    { path: '/withdraw', icon: ArrowDownCircle, label: 'Withdraw' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border-gray shadow-2xl z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-primary-green scale-110'
                  : 'text-text-gray hover:text-primary-green hover:scale-105'
              }`}
            >
              <item.icon 
                className={`h-6 w-6 ${
                  isActive(item.path) ? 'stroke-[2.5]' : 'stroke-[2]'
                }`} 
              />
              <span className={`text-xs font-medium ${
                isActive(item.path) ? 'font-bold' : ''
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="w-1 h-1 bg-primary-green rounded-full mt-1"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
