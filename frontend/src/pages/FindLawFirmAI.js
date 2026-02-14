import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Award, ArrowRight, Send, Bot, Sparkles, User } from 'lucide-react';

export default function FindLawFirmAI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm your AI assistant. I can help you find the perfect law firm for your legal needs. Tell me about your case or what type of legal assistance you're looking for."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedFirms, setRecommendedFirms] = useState([]);

  // Dummy law firms data
  const lawFirmsData = [
    {
      id: '1',
      firm_name: 'Shah & Associates',
      city: 'Delhi',
      state: 'Delhi',
      specialization: ['Civil Law', 'Criminal Law', 'Corporate Law'],
      total_lawyers: 15,
      established_year: 2010,
      cases_handled: 500,
      consultation_fee: 2999,
      description: 'Premier law firm with expertise in civil, criminal, and corporate matters.'
    },
    {
      id: '2',
      firm_name: 'Mehta Legal Solutions',
      city: 'Mumbai',
      state: 'Maharashtra',
      specialization: ['Family Law', 'Property Law', 'Consumer Rights'],
      total_lawyers: 10,
      established_year: 2012,
      cases_handled: 350,
      consultation_fee: 2499,
      description: 'Specialized in family law and property disputes.'
    },
    {
      id: '3',
      firm_name: 'Reddy & Partners',
      city: 'Hyderabad',
      state: 'Telangana',
      specialization: ['Corporate Law', 'Intellectual Property', 'Tax Law'],
      total_lawyers: 20,
      established_year: 2015,
      cases_handled: 650,
      consultation_fee: 3499,
      description: 'Leading corporate law firm serving startups and large corporations.'
    },
    {
      id: '4',
      firm_name: 'Kumar Law Chambers',
      city: 'Bangalore',
      state: 'Karnataka',
      specialization: ['Criminal Law', 'Civil Law', 'Labor Law'],
      total_lawyers: 12,
      established_year: 2008,
      cases_handled: 480,
      consultation_fee: 2299,
      description: 'Experienced criminal and civil law practitioners.'
    },
    {
      id: '5',
      firm_name: 'Patel & Co Legal Advisors',
      city: 'Ahmedabad',
      state: 'Gujarat',
      specialization: ['Real Estate Law', 'Business Law', 'Contract Law'],
      total_lawyers: 8,
      established_year: 2013,
      cases_handled: 280,
      consultation_fee: 1999,
      description: 'Focused on real estate and business law.'
    },
    {
      id: '6',
      firm_name: 'Sharma & Singh Associates',
      city: 'Chennai',
      state: 'Tamil Nadu',
      specialization: ['Family Law', 'Divorce Law', 'Child Custody'],
      total_lawyers: 7,
      established_year: 2016,
      cases_handled: 220,
      consultation_fee: 1799,
      description: 'Compassionate family law experts with high success rate.'
    }
  ];

  const findMatchingFirms = (query) => {
    const lowerQuery = query.toLowerCase();
    let matches = [];

    // Keywords mapping
    const keywordMap = {
      'divorce': ['Family Law', 'Divorce Law'],
      'family': ['Family Law', 'Child Custody'],
      'property': ['Property Law', 'Real Estate Law'],
      'criminal': ['Criminal Law'],
      'corporate': ['Corporate Law', 'Business Law'],
      'business': ['Business Law', 'Corporate Law', 'Contract Law'],
      'tax': ['Tax Law'],
      'startup': ['Corporate Law', 'Intellectual Property'],
      'ip': ['Intellectual Property'],
      'patent': ['Intellectual Property'],
      'labor': ['Labor Law'],
      'employment': ['Labor Law'],
      'consumer': ['Consumer Rights'],
      'real estate': ['Real Estate Law', 'Property Law'],
      'contract': ['Contract Law', 'Business Law']
    };

    // Find matching specializations
    let matchingSpecs = [];
    for (const [keyword, specs] of Object.entries(keywordMap)) {
      if (lowerQuery.includes(keyword)) {
        matchingSpecs = [...matchingSpecs, ...specs];
      }
    }

    if (matchingSpecs.length > 0) {
      matches = lawFirmsData.filter(firm =>
        firm.specialization.some(spec => matchingSpecs.includes(spec))
      );
    }

    // If no keyword matches, return top-rated firms
    if (matches.length === 0) {
      matches = [...lawFirmsData].sort((a, b) => b.total_lawyers - a.total_lawyers).slice(0, 3);
    }

    return matches.slice(0, 3);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
    const userQuery = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const matchedFirms = findMatchingFirms(userQuery);
      setRecommendedFirms(matchedFirms);

      let responseText = '';
      if (matchedFirms.length > 0) {
        responseText = `Based on your query, I've found ${matchedFirms.length} law firm${matchedFirms.length > 1 ? 's' : ''} that specialize in cases like yours. Here are my top recommendations:`;
      } else {
        responseText = "I couldn't find specific matches for your query. Here are some highly-rated law firms that might be able to help:";
      }

      setMessages(prev => [...prev, { type: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleJoinFirm = (firm) => {
    navigate('/join-lawfirm-signup', { state: { firm } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Law Firm Finder</h1>
          <p className="text-xl text-slate-400">Tell me about your legal needs and I'll find the perfect law firm for you</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[600px]"
          >
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'bot'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500'
                    : 'bg-slate-700'
                    }`}>
                    {msg.type === 'bot' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.type === 'bot'
                    ? 'bg-slate-800 text-white rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe your legal needs..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Try: "I need help with a divorce case" or "Looking for corporate lawyers"
              </p>
            </div>
          </motion.div>

          {/* Recommendations Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              {recommendedFirms.length > 0 ? 'Recommended Law Firms' : 'Top Law Firms'}
            </h2>

            {(recommendedFirms.length > 0 ? recommendedFirms : lawFirmsData.slice(0, 3)).map((firm, index) => (
              <motion.div
                key={firm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{firm.firm_name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{firm.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {firm.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {firm.total_lawyers} lawyers
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Since {firm.established_year}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {firm.specialization.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500 text-xs">Consultation</span>
                        <p className="text-blue-400 font-bold">₹{firm.consultation_fee}</p>
                      </div>
                      <button
                        onClick={() => handleJoinFirm(firm)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        Join Firm
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
