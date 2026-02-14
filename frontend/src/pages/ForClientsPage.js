import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, MessageSquare, FileText, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

export default function ForClientsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Built for Clients Like You</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Navigate your legal journey with confidence. We simplify complex legal processes so you can focus on what matters.
            </p>
            <Link to="/user-login">
              <Button 
                data-testid="client-get-started-btn"
                className="bg-blue-700 hover:bg-blue-600 text-white rounded-full px-8 py-3 btn-primary glow-blue"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass rounded-3xl p-8">
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Understand Your Case</h3>
              <p className="text-slate-400 leading-relaxed">
                Legal jargon can be confusing. Our AI assistant explains your case status, legal terms, 
                and next steps in simple, clear language that anyone can understand.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <MessageSquare className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">24/7 AI Support</h3>
              <p className="text-slate-400 leading-relaxed">
                Have a legal question at midnight? Our AI chatbot is always available to provide guidance, 
                answer questions, and help you understand your options.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <FileText className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Track Everything</h3>
              <p className="text-slate-400 leading-relaxed">
                Monitor your case progress, upcoming hearings, and important deadlines all in one place. 
                Never miss a critical date or update again.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-8">
              <Calendar className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Connect with Lawyers</h3>
              <p className="text-slate-400 leading-relaxed">
                When you need professional help, easily book consultations with verified lawyers. 
                Find the right legal expert for your specific case.
              </p>
            </div>
          </div>
          
          {/* Use Cases */}
          <div className="glass rounded-3xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Use Cases</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Civil Cases</h4>
                  <p className="text-slate-400">Property disputes, contract issues, family matters - track and understand your civil case progress</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Criminal Cases</h4>
                  <p className="text-slate-400">Stay informed about your criminal case status and get guidance on legal procedures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Consumer Complaints</h4>
                  <p className="text-slate-400">Navigate consumer court cases and understand your rights as a consumer</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Labor Disputes</h4>
                  <p className="text-slate-400">Get clarity on employment-related legal matters and track case developments</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="glass rounded-3xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <blockquote className="text-xl italic text-slate-300 mb-4">
              "Lxwyer Up helped me understand my case for the first time. The AI chatbot explained everything in simple terms, and I could track all my documents in one place."
            </blockquote>
            <p className="text-slate-400">- Satisfied Client</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}