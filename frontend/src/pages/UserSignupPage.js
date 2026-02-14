import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, ArrowRight, User, Phone, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { motion } from 'framer-motion';
import { CorporateInput, CorporateButton } from '../components/CorporateComponents';

export default function UserSignupPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        user_type: 'client'
      };
      const response = await axios.post(`${API}/auth/signup`, payload);
      
      toast.success('Account created successfully!');
      
      // Auto login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
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

      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Lxwyer Up</span>
          </Link>
          
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Get started with legal assistance</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <CorporateInput
                label="Full Name"
                type="text"
                data-testid="user-name-input"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                icon={User}
                required
              />
              
              <CorporateInput
                label="Email"
                type="email"
                data-testid="user-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                icon={Mail}
                required
              />
              
              <CorporateInput
                label="Phone"
                type="tel"
                data-testid="user-phone-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                icon={Phone}
                required
              />
              
              <CorporateInput
                label="Password"
                type="password"
                data-testid="user-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                icon={Lock}
                required
              />
              
              <CorporateButton
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </CorporateButton>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link to="/user-login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Login
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-slate-400">
                Want to join as Lawyer or Law Firm?{' '}
                <Link to="/role-selection" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Choose Role
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
