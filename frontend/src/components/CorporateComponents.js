import React from 'react';

// Simple card with subtle hover - NO floating animations
export const SimpleCard = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

// Simple icon container - NO rotation or glow
export const IconBox = ({ icon: Icon, className = '' }) => {
  return (
    <div className={`w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center ${className}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
};

// Clean button - solid colors only
export const CorporateButton = ({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick,
  type = 'button',
  disabled = false
}) => {
  const variants = {
    primary: 'px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors duration-200',
    secondary: 'px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-200',
    outline: 'px-6 py-3 border border-slate-700 hover:border-blue-600 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-200',
  };

  return (
    <button
      className={`${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Clean input
export const CorporateInput = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-slate-500" />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-slate-900 border ${
            error ? 'border-red-500' : 'border-slate-700'
          } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors duration-200`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

// Simple stat card
export const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-sm">{title}</p>
    </div>
  );
};

// Simple badge
export const CorporateBadge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-green-900 text-green-300 border-green-800',
    warning: 'bg-yellow-900 text-yellow-300 border-yellow-800',
    error: 'bg-red-900 text-red-300 border-red-800',
    info: 'bg-blue-900 text-blue-300 border-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default {
  SimpleCard,
  IconBox,
  CorporateButton,
  CorporateInput,
  StatCard,
  CorporateBadge,
};
