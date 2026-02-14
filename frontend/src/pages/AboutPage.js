import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Target, Heart, Zap, Users, Shield, Globe, Award, Sparkles, Scale, Building2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Floating Card Component with Glow Effect
const FloatingCard = ({ children, className = '', delay = 0, glowColor = 'blue' }) => {
  const glowColors = {
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    green: 'shadow-green-500/20 hover:shadow-green-500/40',
    amber: 'shadow-amber-500/20 hover:shadow-amber-500/40',
    cyan: 'shadow-cyan-500/20 hover:shadow-cyan-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl ${glowColors[glowColor]} transition-all duration-500 ${className}`}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${glowColor}-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Team Member Card
const TeamCard = ({ name, role, image, delay }) => (
  <FloatingCard delay={delay} glowColor="purple">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/20">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-1">{name}</h4>
      <p className="text-purple-400 text-sm">{role}</p>
    </div>
  </FloatingCard>
);

// Stat Card
const StatCard = ({ number, label, icon: Icon, delay, glowColor }) => (
  <FloatingCard delay={delay} glowColor={glowColor}>
    <div className="text-center">
      <div className={`inline-flex p-4 bg-${glowColor}-500/10 rounded-xl mb-4`}>
        <Icon className={`w-8 h-8 text-${glowColor}-400`} />
      </div>
      <div className="text-4xl font-bold text-white mb-2">{number}</div>
      <p className="text-slate-400">{label}</p>
    </div>
  </FloatingCard>
);

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Clarity',
      description: 'We believe everyone deserves to understand their legal situation in simple, clear language. No more confusing jargon.',
      glowColor: 'blue'
    },
    {
      icon: Heart,
      title: 'Empathy',
      description: 'We understand the stress of legal proceedings and design our platform with human compassion at its core.',
      glowColor: 'purple'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to make the legal system more accessible and efficient for everyone.',
      glowColor: 'amber'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Your data security and privacy are paramount. We maintain the highest standards of confidentiality.',
      glowColor: 'green'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Legal help should be available to everyone, regardless of location or background. We break down barriers.',
      glowColor: 'cyan'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We partner only with verified, experienced legal professionals to ensure quality assistance.',
      glowColor: 'purple'
    }
  ];

  const milestones = [
    { year: '2026', title: 'Founded', description: 'Lxwyer Up was born with a vision to democratize legal assistance' },
    { year: '2026', title: 'AI Integration', description: 'Launched AI-powered case analysis and legal assistant' },
    { year: '2026', title: 'Growing Fast', description: 'Rapidly expanding our network of verified lawyers and law firms' },
    { year: '2026', title: 'Pan-India Vision', description: 'Building towards coverage across all major cities in India' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">About Us</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              About Lxwyer Up
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to bridge the gap between citizens and the justice system using technology, AI, and human expertise
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-500/10"
          >
            <img 
              src="https://images.pexels.com/photos/7841466/pexels-photo-7841466.jpeg" 
              alt="Legal team collaboration" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-2xl font-semibold text-white">Building the future of legal assistance in India</p>
              <p className="text-slate-400 mt-2">A team dedicated to making justice accessible to all</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-white">Making Justice <span className="text-blue-400">Accessible</span> to Everyone</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Every day, millions of people interact with the legal system but struggle to understand their cases, 
                their rights, and their next steps. This confusion leads to anxiety, delays, and injustice.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Lxwyer Up exists to solve this problem by making legal information accessible, understandable, 
                and actionable for everyone—from first-time users to seasoned professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Verified Lawyers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">24/7 Support</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-purple-500/10">
                <img 
                  src="https://images.pexels.com/photos/6077797/pexels-photo-6077797.jpeg" 
                  alt="Justice and technology" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-blue-400">200+</div>
                <div className="text-slate-400 text-sm">Cases Resolved</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-purple-400">100+</div>
                <div className="text-slate-400 text-sm">Verified Lawyers</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
              <Heart className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Our Values</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">What We Stand For</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These core values guide every decision we make and every feature we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <FloatingCard key={value.title} delay={index * 0.1} glowColor={value.glowColor}>
                <div className={`inline-flex p-4 bg-${value.glowColor}-500/10 rounded-xl mb-4`}>
                  <value.icon className={`w-8 h-8 text-${value.glowColor}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Our Journey</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">The Lxwyer Up Story</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <FloatingCard glowColor="amber" className="h-full">
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-lg">
                  <span className="text-amber-400 font-semibold">Lxwyer Up was born from a simple observation:</span> while India has made significant strides in 
                  digitalizing court records and case data, most citizens still struggle to make sense of this information.
                </p>
                <p>
                  The legal language is complex, the processes are confusing, and finding reliable help is expensive and time-consuming. 
                  We realized that technology—especially AI—could transform this experience.
                </p>
                <p>
                  Our founders, having witnessed the struggles of common people navigating the legal system, decided to create a platform 
                  that would democratize access to legal assistance. Today, Lxwyer Up serves both citizens and legal professionals, 
                  creating a more transparent, efficient, and humane justice system for all.
                </p>
              </div>
            </FloatingCard>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <span className="text-amber-400 font-bold">{milestone.year}</span>
                  </div>
                  <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-1">{milestone.title}</h4>
                    <p className="text-slate-400 text-sm">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-blue-900/10" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard number="200+" label="Cases Resolved" icon={Scale} delay={0} glowColor="blue" />
            <StatCard number="100+" label="Verified Lawyers" icon={Users} delay={0.1} glowColor="purple" />
            <StatCard number="25+" label="Trusted Law Firms" icon={Building2} delay={0.2} glowColor="green" />
            <StatCard number="98%" label="Client Satisfaction" icon={Award} delay={0.3} glowColor="amber" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FloatingCard glowColor="blue" className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their legal journey with Lxwyer Up
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/role-selection" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30"
              >
                Get Started Now
              </a>
              <a 
                href="/contact" 
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
              >
                Contact Us
              </a>
            </div>
          </FloatingCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
