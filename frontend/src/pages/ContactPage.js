import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../App';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, 
  CheckCircle, ArrowRight, Globe, Headphones, Shield, Heart,
  Users, Building2, Scale
} from 'lucide-react';

// Floating Card Component
const FloatingCard = ({ children, className = '', delay = 0, glowColor = 'blue' }) => {
  const glowColors = {
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40 hover:border-blue-500/50',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40 hover:border-purple-500/50',
    green: 'shadow-green-500/20 hover:shadow-green-500/40 hover:border-green-500/50',
    amber: 'shadow-amber-500/20 hover:shadow-amber-500/40 hover:border-amber-500/50',
    pink: 'shadow-pink-500/20 hover:shadow-pink-500/40 hover:border-pink-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl ${glowColors[glowColor]} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Contact Method Card
const ContactMethodCard = ({ icon: Icon, title, value, description, color, delay }) => (
  <FloatingCard delay={delay} glowColor={color} className="p-6">
    <div className="flex items-start gap-4">
      <div className={`p-4 bg-${color}-500/10 rounded-xl border border-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className={`text-${color}-400 font-medium`}>{value}</p>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
    </div>
  </FloatingCard>
);

// Feature Badge
const FeatureBadge = ({ icon: Icon, text, color }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${color}-500/10 border border-${color}-500/20 rounded-full`}>
    <Icon className={`w-4 h-4 text-${color}-400`} />
    <span className={`text-${color}-400 text-sm font-medium`}>{text}</span>
  </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API}/waitlist`, formData);
      toast.success('Thank you! We\'ll be in touch soon.');
      setFormData({ full_name: '', email: '', message: '' });
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('You\'re already on our waitlist!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Sparkles, text: 'Priority Access', color: 'amber' },
    { icon: Shield, text: 'Free Trial', color: 'green' },
    { icon: Heart, text: 'Exclusive Updates', color: 'pink' },
  ];
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Contact Us</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Let's Start a Conversation
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Have questions about legal assistance? Want early access to our platform? 
              We're here to help you navigate your legal journey.
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {benefits.map((benefit, idx) => (
                <FeatureBadge key={idx} {...benefit} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Form & Image */}
            <div className="space-y-8">
              {/* Hero Image Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-500/10"
              >
                <img 
                  src="https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg" 
                  alt="Customer support team" 
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">We're Here to Help</h3>
                  <p className="text-slate-300">Our team responds within 2 hours during business hours</p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <FloatingCard glowColor="blue" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl shadow-lg shadow-blue-500/25">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Join Our Waitlist</h2>
                    <p className="text-slate-400 text-sm">Be the first to access Lxwyer Up</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <Input
                      data-testid="contact-name-input"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="bg-slate-900 border-slate-700 focus:border-blue-500 rounded-xl py-3 text-white placeholder-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <Input
                      data-testid="contact-email-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="bg-slate-900 border-slate-700 focus:border-blue-500 rounded-xl py-3 text-white placeholder-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message (Optional)</label>
                    <Textarea
                      data-testid="contact-message-input"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you're looking for..."
                      rows={4}
                      className="bg-slate-900 border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500"
                    />
                  </div>
                  
                  <Button
                    data-testid="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl py-6 text-lg font-semibold shadow-lg shadow-blue-500/25 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Join Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No spam
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-pink-500" />
                      Free forever
                    </span>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <ContactMethodCard 
                icon={Mail} 
                title="Email Us" 
                value="support@lxwyerup.com" 
                description="We reply within 24 hours"
                color="blue"
                delay={0.1}
              />
              
              <ContactMethodCard 
                icon={Phone} 
                title="Call Us" 
                value="+91 1800-XXX-XXXX" 
                description="Mon-Sat, 9am-6pm IST (Toll Free)"
                color="green"
                delay={0.2}
              />
              
              <ContactMethodCard 
                icon={MapPin} 
                title="Visit Us" 
                value="Sonipat, Haryana, India" 
                description="By appointment only"
                color="purple"
                delay={0.3}
              />

              {/* Office Hours Card */}
              <FloatingCard delay={0.4} glowColor="amber" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Office Hours</h3>
                    <p className="text-slate-400 text-sm">Indian Standard Time (IST)</p>
                  </div>
                </div>
                <div className="space-y-3 ml-16">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Monday - Friday</span>
                    <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Saturday</span>
                    <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sunday</span>
                    <span className="text-red-400 font-medium">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 ml-16">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm">AI Assistant available 24/7</span>
                  </div>
                </div>
              </FloatingCard>

              {/* Quick Links Image Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="relative rounded-2xl overflow-hidden border border-slate-700/50"
              >
                <img 
                  src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg" 
                  alt="Legal consultation" 
                  className="w-full h-[200px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Need Immediate Help?</h3>
                  <div className="flex flex-wrap gap-2">
                    <a href="/how-it-works" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
                      How It Works
                    </a>
                    <a href="/about" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                      About Us
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Why People Trust Us</h2>
                <p className="text-slate-400">Join thousands who have found legal help through Lxwyer Up</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Users, value: '200+', label: 'Cases Resolved', color: 'blue' },
                  { icon: Scale, value: '100+', label: 'Verified Lawyers', color: 'purple' },
                  { icon: Building2, value: '25+', label: 'Law Firms', color: 'green' },
                  { icon: Headphones, value: '90%+', label: 'User Satisfaction', color: 'amber' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className={`inline-flex p-3 bg-${stat.color}-500/10 rounded-xl mb-3`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <p className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <FloatingCard glowColor="blue" className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Our Location</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Visit Our Office</h2>
                <p className="text-slate-400 mb-6">
                  Located in the heart of Sonipat, Haryana. We welcome you to visit us for 
                  in-person consultations. Please schedule an appointment beforehand.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Lxwyer Up Legal Tech</p>
                      <p className="text-slate-400 text-sm">Sonipat, Haryana 131001, India</p>
                    </div>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Sonipat,Haryana,India" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="relative h-[300px] lg:h-auto">
                <img 
                  src="https://images.pexels.com/photos/5668776/pexels-photo-5668776.jpeg" 
                  alt="Office location" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent lg:from-slate-900/50" />
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
