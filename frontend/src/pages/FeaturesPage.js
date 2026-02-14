import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MessageSquare, FileText, Calendar, Bell, Shield, BarChart, Users, Clock } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Legal Chatbot',
      description: 'Get instant answers to your legal questions in simple, structured language. Available 24/7 to guide you through complex legal concepts.',
      forWho: 'Both'
    },
    {
      icon: FileText,
      title: 'Case Tracking',
      description: 'Monitor your case status, stage, and timelines in real-time. Never miss an important update or deadline.',
      forWho: 'Clients'
    },
    {
      icon: Shield,
      title: 'Document Management',
      description: 'Securely upload, organize, and access all your legal documents from anywhere. Everything encrypted and safe.',
      forWho: 'Both'
    },
    {
      icon: Calendar,
      title: 'Consultation Booking',
      description: 'Schedule appointments with verified lawyers at your convenience. Manage all consultations in one calendar.',
      forWho: 'Clients'
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Lawyers can manage multiple clients, track cases, and maintain professional communication efficiently.',
      forWho: 'Lawyers'
    },
    {
      icon: Bell,
      title: 'Automated Updates',
      description: 'Clients receive automatic notifications about case progress, upcoming hearings, and important deadlines.',
      forWho: 'Both'
    },
    {
      icon: BarChart,
      title: 'Case Analytics',
      description: 'Get insights into case progress, success patterns, and recommendations for next steps.',
      forWho: 'Both'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access your dashboard, documents, and AI assistant any time, from any device.',
      forWho: 'Both'
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to navigate the legal system with confidence
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass rounded-2xl p-8 feature-card">
                  <div className="inline-flex p-3 bg-blue-700/20 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 mb-4">{feature.description}</p>
                  <span className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                    For {feature.forWho}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}