import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronUp } from 'lucide-react';

export default function InitialLanding() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/Supreme_Court_of_India_-_200705_%28edited%29.jpg"
          alt="Indian Supreme Court"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight"
        >
          <span className="text-orange-600">Justice</span> You Understand,
          <br />
          <span className="text-blue-600">Technology</span> You Trust
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Experience the future of legal services in India
        </motion.p>
        
        {/* Main button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
          className="mb-16"
        >
          <button
            data-testid="initial-get-started-btn"
            onClick={() => navigate('/role-selection')}
            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl rounded-full flex items-center space-x-3 mx-auto group transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Get Started</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Swipe Up Arrow */}
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm text-gray-500 mb-2">Explore more</p>
          <ChevronUp className="w-6 h-6 text-blue-600" />
        </motion.div>
      </motion.div>
      
      {/* Subtle branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm"
      >
        Lxwyer Up
      </motion.div>
    </div>
  );
}