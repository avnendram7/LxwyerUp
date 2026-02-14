import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { motion } from 'framer-motion';
import { CorporateInput, CorporateButton } from '../components/CorporateComponents';

export default function UserLoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = { email: formData.email, password: formData.password, user_type: 'client' };
      const response = await axios.post(`${API}/auth/login`, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Welcome back!');
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex flex-col">
      {/* Navigation Bar */}
      <nav className="p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
      </nav>

      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Lxwyer Up</span>
          </Link>
          
          {/* Card */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Client Login</h2>
              <p className="text-slate-400">Welcome back! Sign in to continue</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <CorporateInput
                label="Email Address"
                type="email"
                data-testid="user-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                icon={Mail}
                required
              />
              
              <CorporateInput
                label="Password"
                type="password"
                data-testid="user-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                icon={Lock}
                required
              />
              
              <CorporateButton
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </CorporateButton>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/user-signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/role-selection?mode=login" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
                Login as different role
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}