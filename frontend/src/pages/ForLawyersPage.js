import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Clock, FileText, BarChart, Calendar, Zap } from 'lucide-react';

export default function ForLawyersPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Empower Your Practice</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Modern tools for modern lawyers. Manage clients, cases, and communications efficiently in one platform.
            </p>
            <Link to="/lawyer-login">
              <Button 
                data-testid="lawyer-get-started-btn"
                className="bg-blue-700 hover:bg-blue-600 text-white rounded-full px-8 py-3 btn-primary glow-blue"
              >
                Join as a Lawyer
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass rounded-3xl p-8">
              <Users className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Client Management</h3>
              <p className="text-slate-400 leading-relaxed">
                Manage all your clients in one place. Access case details, documents, and communication history 
                instantly. Keep your practice organized and professional.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <Clock className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Save Time</h3>
              <p className="text-slate-400 leading-relaxed">
                Automated case summaries and document organization save hours of administrative work. 
                Focus on what you do best - practicing law.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <FileText className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Structured Case Data</h3>
              <p className="text-slate-400 leading-relaxed">
                Get AI-generated case summaries and insights. All case information organized and easily accessible 
                when you need it most.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <Calendar className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Scheduling Made Easy</h3>
              <p className="text-slate-400 leading-relaxed">
                Manage consultation bookings, appointments, and deadlines in one calendar. 
                Clients can book slots based on your availability.
              </p>
            </div>
          </div>
          
          {/* Features for Lawyers */}
          <div className="glass rounded-3xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Professional Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-700/20 rounded-xl mb-4">
                  <BarChart className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-bold text-lg mb-2">Dashboard Analytics</h4>
                <p className="text-slate-400 text-sm">Track your practice metrics and client engagement</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-700/20 rounded-xl mb-4">
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-bold text-lg mb-2">Automated Updates</h4>
                <p className="text-slate-400 text-sm">Send case updates to clients automatically</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-700/20 rounded-xl mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-bold text-lg mb-2">Document Repository</h4>
                <p className="text-slate-400 text-sm">Secure storage for all client documents</p>
              </div>
            </div>
          </div>
          
          {/* Why Join */}
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Why Lawyers Choose Lxwyer Up</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-500 font-bold">1</span>
                </div>
                <p className="text-slate-300">Reduce administrative overhead and focus more on casework</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-500 font-bold">2</span>
                </div>
                <p className="text-slate-300">Provide better service to clients with organized information</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-500 font-bold">3</span>
                </div>
                <p className="text-slate-300">Connect with clients who are actively seeking legal help</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-500 font-bold">4</span>
                </div>
                <p className="text-slate-300">Build your professional reputation on a trusted platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}