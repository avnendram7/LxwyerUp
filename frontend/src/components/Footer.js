import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">Lxwyer Up</span>
            </div>
            <p className="text-slate-400 text-sm">
              Simplifying the justice system using technology and AI
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-slate-400 hover:text-white text-sm transition-colors">About Us</Link>
              <Link to="/features" className="block text-slate-400 hover:text-white text-sm transition-colors">Features</Link>
              <Link to="/how-it-works" className="block text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link>
              <Link to="/contact" className="block text-slate-400 hover:text-white text-sm transition-colors">Contact</Link>
            </div>
          </div>
          
          {/* For Users */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Users</h3>
            <div className="space-y-2">
              <Link to="/for-clients" className="block text-slate-400 hover:text-white text-sm transition-colors">For Clients</Link>
              <Link to="/for-lawyers" className="block text-slate-400 hover:text-white text-sm transition-colors">For Lawyers</Link>
              <Link to="/user-login" className="block text-slate-400 hover:text-white text-sm transition-colors">Client Login</Link>
              <Link to="/lawyer-login" className="block text-slate-400 hover:text-white text-sm transition-colors">Lawyer Login</Link>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>avnendram.7@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+91 83182 16968</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Sonipat, Haryana, India</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Lxwyer Up. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};