import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Building2, User, ArrowRight, Sparkles, Search } from 'lucide-react';
import NavigationHeader from '../components/NavigationHeader';

export default function UserGetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation Header */}
      <NavigationHeader 
        backPath="/role-selection"
        showBack={true}
        showHome={true}
        showLogout={false}
      />

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get Started with Legal Assistance</h1>
          <p className="text-xl text-slate-400">Choose how you want to find legal help</p>
        </motion.div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: Independent Lawyer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-3">I Want a Lawyer</h2>
            <p className="text-slate-400 text-center mb-6">Connect with verified independent lawyers across India</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Browse verified lawyers by specialization</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Direct consultation with lawyers</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Flexible pricing and consultation options</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/find-lawyer/ai')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5" />
                Find with AI Assistant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/find-lawyer/manual')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Search className="w-5 h-5" />
                Browse Manually
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Option 2: Law Firm */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-3">I Want a Law Firm</h2>
            <p className="text-slate-400 text-center mb-6">Join established law firms with comprehensive legal services</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Access to team of specialized lawyers</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Comprehensive case management</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-slate-300 text-sm">Established reputation and resources</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/find-lawfirm/ai')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5" />
                Find with AI Assistant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/find-lawfirm/manual')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Search className="w-5 h-5" />
                Browse Law Firms
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            Not sure which option to choose? Our AI assistant can help you decide!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
