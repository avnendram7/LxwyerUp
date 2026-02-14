import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Send, Bot, MessageSquare } from 'lucide-react';
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
              onClick={() => navigate('/browse-lawyers')}
              variant="ghost"
              className="text-[#0F2944] hover:text-[#0F2944]/80"
            >
              Try Manual Search
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

const AIChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: 'Thank you for sharing. Based on your case, I recommend connecting with specialized lawyers. Let me find the best matches for you.', 
          sender: 'ai' 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full mb-6">
              <Bot className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">AI Legal Assistant</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0F2944] mb-4">
              Chat with AI to Find Lawyers
            </h1>
            <p className="text-lg text-gray-600">
              Describe your case and get personalized recommendations
            </p>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-6">
              {/* Welcome Message */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-[#0F2944] mb-2">Welcome to Lxwyer Up AI</h3>
                    <p className="text-gray-700">
                      Hello! I'm your AI legal assistant. I'll help you find the perfect lawyer for your case.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instruction Message */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-[#0F2944] mb-2">Tell Me About Your Case</h3>
                    <p className="text-gray-700 mb-2">
                      Please describe your legal issue. For example:
                    </p>
                    <p className="text-gray-600 text-sm italic">
                      "I have a property dispute" or "Need help with divorce case"
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Messages */}
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`flex-1 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`rounded-2xl p-4 max-w-[80%] ${msg.sender === 'user' ? 'bg-[#0F2944] text-white ml-auto' : 'bg-gray-50 text-gray-700'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe your legal issue..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944] text-gray-900 placeholder:text-gray-400"
                />
                <Button
                  onClick={handleSend}
                  className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white px-6 py-3 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;