import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  UserPlus, MessageSquare, FileText, Calendar, CheckCircle, Scale, ArrowRight,
  Sparkles, Users, Building2, Shield, Clock, Phone, Mail, HelpCircle, BookOpen,
  Video, Headphones, Search, Gavel, Award, Zap, Heart, Lock, Globe, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Floating Card with Glow
const FloatingCard = ({ children, className = '', delay = 0, glowColor = 'blue' }) => {
  const glowColors = {
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40 hover:border-blue-500/50',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40 hover:border-purple-500/50',
    green: 'shadow-green-500/20 hover:shadow-green-500/40 hover:border-green-500/50',
    amber: 'shadow-amber-500/20 hover:shadow-amber-500/40 hover:border-amber-500/50',
    cyan: 'shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:border-cyan-500/50',
    pink: 'shadow-pink-500/20 hover:shadow-pink-500/40 hover:border-pink-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl ${glowColors[glowColor]} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Step Card
const StepCard = ({ number, icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="relative group"
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${color}-600 to-${color}-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
    <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className={`relative w-14 h-14 bg-gradient-to-br from-${color}-600 to-${color}-400 rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
          <span className={`absolute -top-2 -right-2 w-6 h-6 bg-${color}-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900`}>
            {number}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// FAQ Item
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700/50 bg-slate-900/50'}`}>
    <button onClick={onClick} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors">
      <span className="font-semibold text-white pr-4">{question}</span>
      <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
    </button>
    {isOpen && <p className="px-6 pb-5 text-slate-400">{answer}</p>}
  </div>
);

export default function HowItWorksPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const steps = [
    { icon: UserPlus, title: 'Create Account', description: 'Sign up in 30 seconds with email or phone', color: 'blue' },
    { icon: FileText, title: 'Describe Your Case', description: 'Tell us about your legal needs in simple words', color: 'purple' },
    { icon: Sparkles, title: 'Get AI Analysis', description: 'Our AI analyzes and explains your situation', color: 'cyan' },
    { icon: Search, title: 'Find Lawyers', description: 'Browse matched lawyers or let AI recommend', color: 'amber' },
    { icon: Calendar, title: 'Book Consultation', description: 'Schedule video call or in-person meeting', color: 'green' },
    { icon: Gavel, title: 'Get Representation', description: 'Work with your lawyer to resolve your case', color: 'pink' }
  ];

  const features = [
    { icon: Shield, title: 'Verified Lawyers', description: 'All lawyers are bar council verified', color: 'green' },
    { icon: Lock, title: 'Data Security', description: 'Bank-grade encryption for your data', color: 'blue' },
    { icon: Clock, title: '24/7 AI Support', description: 'Get answers anytime, anywhere', color: 'purple' },
    { icon: Award, title: 'Quality Assured', description: 'Rated 4.8/5 by our users', color: 'amber' },
    { icon: Heart, title: 'Client First', description: 'Your satisfaction is our priority', color: 'pink' },
    { icon: Zap, title: 'Fast Response', description: 'Connect with lawyers within hours', color: 'cyan' }
  ];

  const faqs = [
    { question: 'Is Lxwyer Up free to use?', answer: 'Creating an account and using our AI assistant is completely free. Lawyer consultation fees vary based on the lawyer\'s experience and case complexity.' },
    { question: 'How are lawyers verified?', answer: 'Every lawyer undergoes a 3-step verification: Bar council registration check, experience verification, and background check.' },
    { question: 'Is my information secure?', answer: 'Absolutely! We use 256-bit SSL encryption. Your case information is confidential and only shared with lawyers you choose.' },
    { question: 'What types of cases can I get help with?', answer: 'We cover Civil, Criminal, Family, Property, Corporate, Tax, Intellectual Property, Consumer, and Labor disputes.' },
    { question: 'How does the AI assistant work?', answer: 'Our AI is trained on Indian legal procedures and case law. It understands your questions in plain language and provides accurate explanations.' },
    { question: 'Can I cancel consultations?', answer: 'Yes! Cancel or reschedule up to 24 hours before for a full refund. Changes within 24 hours depend on the lawyer\'s policy.' }
  ];

  const support = [
    { icon: MessageSquare, title: 'Live Chat', description: 'Instant support', color: 'blue' },
    { icon: Mail, title: 'Email', description: 'support@lxwyerup.com', color: 'purple' },
    { icon: Phone, title: 'Phone', description: '+91 1800-XXX-XXXX', color: 'green' },
    { icon: BookOpen, title: 'Help Articles', description: 'Browse guides', color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Help Center</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              How Can We Help You?
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Get answers to your questions and learn how we make legal assistance accessible to everyone.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, guides..."
                className="w-full pl-14 pr-6 py-5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Cases Resolved', value: '200+', color: 'blue' },
              { label: 'Verified Lawyers', value: '100+', color: 'purple' },
              { label: 'User Satisfaction', value: '98%', color: 'green' },
              { label: 'Response Time', value: '<2 hrs', color: 'amber' }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className={`bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-${stat.color}-500/50 transition-colors`}
              >
                <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Our Services</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">What We Offer</h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <FloatingCard glowColor="blue">
              <div className="text-center mb-4">
                <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-4">
                  <Search className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Legal Assistant</h3>
                <p className="text-slate-400 mt-2">Get instant answers to your legal questions</p>
              </div>
              <img src="https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg" alt="AI" className="w-full h-40 object-cover rounded-xl mb-4" />
              <ul className="space-y-2">
                {['Ask questions in plain language', 'Get legal term explanations', 'Understand your rights', 'Available 24/7 for free'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />{f}
                  </li>
                ))}
              </ul>
            </FloatingCard>

            <FloatingCard glowColor="purple">
              <div className="text-center mb-4">
                <div className="inline-flex p-4 bg-purple-500/10 rounded-2xl mb-4">
                  <Scale className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Lawyer Matching</h3>
                <p className="text-slate-400 mt-2">Find the perfect lawyer for your case</p>
              </div>
              <img src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg" alt="Lawyers" className="w-full h-40 object-cover rounded-xl mb-4" />
              <ul className="space-y-2">
                {['Browse verified profiles', 'Filter by specialization', 'View verified credentials', 'Compare fees'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400" />{f}
                  </li>
                ))}
              </ul>
            </FloatingCard>

            <FloatingCard glowColor="green">
              <div className="text-center mb-4">
                <div className="inline-flex p-4 bg-green-500/10 rounded-2xl mb-4">
                  <Building2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Law Firm Services</h3>
                <p className="text-slate-400 mt-2">Access comprehensive legal services</p>
              </div>
              <img src="https://images.pexels.com/photos/5668776/pexels-photo-5668776.jpeg" alt="Law Firm" className="w-full h-40 object-cover rounded-xl mb-4" />
              <ul className="space-y-2">
                {['Corporate legal solutions', 'Multi-lawyer teams', 'End-to-end handling', 'Dedicated manager'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />{f}
                  </li>
                ))}
              </ul>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute left-0 top-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Get legal help in 6 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <StepCard key={idx} number={idx + 1} icon={step.icon} title={step.title} description={step.description} color={step.color} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">The Lxwyer Up Advantage</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <FloatingCard key={idx} delay={idx * 0.1} glowColor={item.color}>
                <div className={`inline-flex p-3 bg-${item.color}-500/10 rounded-xl mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute right-0 top-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} isOpen={openFAQ === idx} onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-4">
              <Headphones className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 text-sm font-medium">Support</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Need More Help?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {support.map((item, idx) => (
              <FloatingCard key={idx} delay={idx * 0.1} glowColor={item.color}>
                <div className="text-center">
                  <div className={`inline-flex p-4 bg-${item.color}-500/10 rounded-xl mb-4`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FloatingCard glowColor="blue" className="text-center">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-slate-400 mb-8">Join thousands who have found legal help through Lxwyer Up!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/role-selection" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700">
                <Phone className="w-5 h-5" /> Contact Us
              </a>
            </div>
          </FloatingCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
