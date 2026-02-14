import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const PremiumContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <ContactHero fadeInUp={fadeInUp} />

      {/* Contact Form & Details */}
      <ContactFormSection 
        formData={formData} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fadeInUp={fadeInUp}
      />

      {/* Map/Visual Section */}
      <VisualSection fadeInUp={fadeInUp} />

      {/* Final CTA */}
      <FinalCTA fadeInUp={fadeInUp} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Contact Hero Component
const ContactHero = ({ fadeInUp }) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F2944] via-[#1a3a5c] to-[#0F2944] pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contactGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contactGrid)" />
          </svg>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [15, -15, 15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's Connect
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Have questions? Need legal assistance? We're here to help you navigate your legal journey
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Form Section Component
const ContactFormSection = ({ formData, handleChange, handleSubmit, isSubmitting, fadeInUp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'avnendram.7@gmail.com',
      link: 'mailto:avnendram.7@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 8318216968',
      link: 'tel:+918318216968'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Sonipat, Haryana, India',
      link: null
    }
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-[#0F2944] mb-4">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0F2944] mb-2">
                  Full Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#0F2944] focus:outline-none transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F2944] mb-2">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#0F2944] focus:outline-none transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F2944] mb-2">
                  Phone Number
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#0F2944] focus:outline-none transition-all duration-300"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F2944] mb-2">
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#0F2944] focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Tell us about your legal needs..."
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F2944] hover:bg-[#1a3a5c] text-white py-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-[#0F2944] mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us through any of these channels
            </p>

            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#0F2944] rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F2944] mb-1">{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link}
                        className="text-gray-600 hover:text-[#0F2944] transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-[#0F2944] to-[#1a3a5c] p-8 rounded-3xl text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Office Hours</h3>
              <div className="space-y-2 text-blue-100">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-blue-200">
                  For urgent matters, our AI assistant is available 24/7
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Visual Section Component
const VisualSection = ({ fadeInUp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#0F2944] mb-4">
            Professional Legal Services Across India
          </h2>
          <p className="text-xl text-gray-600">
            Serving clients from major cities to rural areas with equal dedication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1546104294-d656c99943fd"
            alt="Justice and Legal Services"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2944]/80 via-[#0F2944]/40 to-transparent flex items-end">
            <div className="p-12 text-white w-full">
              <div className="grid sm:grid-cols-3 gap-8">
                {[
                  { number: '20+', label: 'Cities Covered' },
                  { number: '500+', label: 'Verified Lawyers' },
                  { number: '24/7', label: 'Support Available' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Component
const FinalCTA = ({ fadeInUp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="bg-gradient-to-br from-[#0F2944] to-[#1a3a5c] rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free consultation and let our experts guide you through your legal options
          </p>
          <Button
            onClick={() => window.location.href = '/role-selection'}
            className="bg-white text-[#0F2944] hover:bg-blue-50 text-lg px-10 py-6 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            Book Free Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#0F2944] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Mail className="w-6 h-6" />
          <span className="text-xl font-bold">Lxwyer Up</span>
        </div>
        <p className="text-blue-200 text-sm mb-6">
          Justice You Understand, Technology You Trust
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="border-t border-white/10 pt-6 text-blue-200 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Lxwyer Up. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default PremiumContact;
