import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Scale, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const SimpleNavbar = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-[#0F2944]" />
            <span className="text-xl font-bold text-[#0F2944]">Lxwyer Up</span>
          </button>
          
          <Button
            onClick={() => navigate('/')}
            className="text-[#0F2944] hover:text-[#0F2944]/80"
            variant="ghost"
          >
            Home
          </Button>
        </div>
      </div>
    </nav>
  );
};

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode'); // 'login' or null for signup

  const roles = [
    {
      icon: User,
      title: 'I am a User',
      description: 'Seeking legal advice? Connect with top-tier professionals seamlessly.',
      path: mode === 'login' ? '/user-login' : '/legal-assistance',
      color: '#0F2944'
    },
    {
      icon: Scale,
      title: 'I am a Lawyer',
      description: 'Join our network. Build your practice and reach clients effectively.',
      path: mode === 'login' ? '/lawyer-login' : '/lawyer-application',
      color: '#0F2944'
    },
    {
      icon: Building2,
      title: 'I am a Law Firm',
      description: 'Manage your firm, onboard lawyers, and scale your legal operations.',
      path: mode === 'login' ? '/lawfirm-login' : '/lawfirm-application',
      color: '#0F2944'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0F2944] mb-4">
              Get Started
            </h1>
            <p className="text-lg text-gray-600">
              Select how you want to use Lxwyer Up
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${role.color}15` }}
                    >
                      <Icon className="w-10 h-10" style={{ color: role.color }} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#0F2944] mb-4">
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {role.description}
                    </p>
                    
                    <Button
                      onClick={() => navigate(role.path)}
                      className="w-full bg-[#0F2944] hover:bg-[#0F2944]/90 text-white py-6 rounded-xl font-semibold transition-all duration-300 group"
                    >
                      GET STARTED
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#0F2944] font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;