import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Send, Sparkles, MessageSquare, MapPin, Users, Calendar, ArrowRight, Building2 } from 'lucide-react';
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

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/browse-firms')}
              variant="ghost"
              className="text-[#0F2944] hover:text-[#0F2944]/80"
            >
              Browse Law Firms
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-[#0F2944] hover:text-[#0F2944]/80"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/role-selection')}
              className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AILawFirmFinder = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const topFirms = [
    {
      name: 'Shah & Associates',
      description: 'Premier law firm with expertise in civil, criminal, and corporate matters.',
      location: 'Delhi',
      lawyers: 15,
      since: 2010,
      areas: ['Civil Law', 'Criminal Law'],
      consultation: '₹2999'
    },
    {
      name: 'Mehta Legal Solutions',
      description: 'Specialized in family law and property disputes.',
      location: 'Mumbai',
      lawyers: 10,
      since: 2012,
      areas: ['Family Law', 'Property Law'],
      consultation: '₹2499'
    },
    {
      name: 'Reddy & Partners',
      description: 'Leading corporate law firm serving startups and large corporations.',
      location: 'Hyderabad',
      lawyers: 20,
      since: 2015,
      areas: ['Corporate Law', 'Intellectual Property'],
      consultation: '₹2499'
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0F2944] mb-4">
              AI Law Firm Finder
            </h1>
            <p className="text-lg text-gray-600">
              Tell me about your legal needs and I'll find the perfect law firm for you
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-gray-700">
                          Hello! I'm your AI assistant. I can help you find the perfect law firm for your legal needs. Tell me about your case or what type of legal assistance you're looking for.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Describe your legal needs..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944] text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-sm text-gray-500">
                      Try: "I need help with a divorce case" or "Looking for corporate lawyers"
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4">
                  <Button
                    onClick={handleSend}
                    className="w-full bg-[#0F2944] hover:bg-[#0F2944]/90 text-white py-3 rounded-xl font-semibold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Top Law Firms Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Top Law Firms</h2>
                </div>

                {topFirms.map((firm, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-[#0F2944]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-[#0F2944]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0F2944] mb-1">{firm.name}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{firm.description}</p>

                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{firm.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{firm.lawyers} lawyers</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Since {firm.since}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {firm.areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#0F2944]/10 text-[#0F2944] text-xs rounded-full font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Consultation</p>
                        <p className="text-lg font-bold text-[#0F2944]">{firm.consultation}</p>
                      </div>
                      <Button
                        className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white px-6 py-3 rounded-xl font-semibold group"
                      >
                        Join Firm
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILawFirmFinder;