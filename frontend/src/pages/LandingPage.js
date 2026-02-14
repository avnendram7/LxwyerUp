import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, FileText, Scale, Shield, Clock, Users, TrendingUp, ChevronUp, Gavel, BookOpen, UserCheck, Phone, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingPage() {
  const [showAllServices, setShowAllServices] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                <span className="text-orange-600">Justice</span> You Understand,
                <br />
                <span className="text-blue-600">Technology</span> You Trust
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl">
                Connect with verified Indian lawyers, get AI-powered legal guidance, and navigate the Indian legal system with confidence
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/user-get-started">
                  <Button 
                    data-testid="get-started-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 text-lg font-medium shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button 
                    data-testid="learn-more-btn"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-4 text-lg"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Swipe Up Arrow */}
              <motion.div 
                className="mt-12 flex flex-col items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-sm text-gray-500 mb-2">Explore our services</p>
                <ChevronUp className="w-6 h-6 text-blue-600" />
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/65/Supreme_Court_of_India_-_200705_%28edited%29.jpg"
                  alt="Indian Supreme Court Building"
                  className="w-full h-[500px] object-cover brightness-110 contrast-110 saturate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-sm font-semibold text-gray-800">Supreme Court of India</p>
                    <p className="text-xs text-gray-600">Where justice meets technology</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services We Offer */}
      <section data-testid="services-section" className="py-20 px-4 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Services We Offer</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Comprehensive legal solutions tailored for the Indian legal system</p>
          </div>
          
          {/* Main Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* AI Legal Assistant */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-testid="ai-chat-feature"
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="AI Legal Assistant helping Indian citizens"
                  className="w-full h-48 object-cover rounded-2xl brightness-110 contrast-110 saturate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent rounded-2xl" />
                <div className="absolute top-4 left-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Legal Assistant</h3>
              <p className="text-gray-600 mb-6">
                Get instant answers to your legal questions in Hindi and English. Our AI understands Indian laws and provides guidance 24/7.
              </p>
              <Link to="/user-login">
                <Button 
                  data-testid="try-ai-chat-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 w-full"
                >
                  Try AI Chat
                </Button>
              </Link>
            </motion.div>
            
            {/* Lawyer Consultation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              data-testid="consultation-feature"
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Indian lawyer consultation"
                  className="w-full h-48 object-cover rounded-2xl brightness-110 contrast-110 saturate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent rounded-2xl" />
                <div className="absolute top-4 left-4">
                  <div className="p-3 bg-green-600 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lawyer Consultation</h3>
              <p className="text-gray-600 mb-6">
                Connect with verified Indian lawyers specializing in your legal matter. Book consultations at your convenience.
              </p>
              <Link to="/book-consultation">
                <Button 
                  data-testid="book-consultation-btn"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 w-full"
                >
                  Book Consultation
                </Button>
              </Link>
            </motion.div>
            
            {/* Document Services */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Legal document preparation in India"
                  className="w-full h-48 object-cover rounded-2xl brightness-110 contrast-110 saturate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent rounded-2xl" />
                <div className="absolute top-4 left-4">
                  <div className="p-3 bg-orange-600 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Document Services</h3>
              <p className="text-gray-600 mb-6">
                Professional drafting of legal documents, contracts, and agreements as per Indian law requirements.
              </p>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 py-2 w-full"
              >
                Get Documents
              </Button>
            </motion.div>
          </div>

          {/* More Services Button */}
          {!showAllServices && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllServices(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-3 text-lg"
              >
                <MoreHorizontal className="w-5 h-5 mr-2" />
                View All Services
              </Button>
            </div>
          )}

          {/* Additional Services - Shown when "More" is clicked */}
          {showAllServices && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Court Representation</h4>
                <p className="text-gray-600 text-sm">Professional representation in Indian courts</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="p-3 bg-indigo-600 rounded-xl w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Legal Research</h4>
                <p className="text-gray-600 text-sm">Comprehensive legal research and case analysis</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="p-3 bg-teal-600 rounded-xl w-fit mb-4">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Legal Compliance</h4>
                <p className="text-gray-600 text-sm">Ensure your business complies with Indian laws</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="p-3 bg-red-600 rounded-xl w-fit mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Emergency Legal Help</h4>
                <p className="text-gray-600 text-sm">24/7 emergency legal assistance</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Why Choose Lxwyer Up?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Experience the future of legal services in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Indian Legal Expertise</h3>
              <p className="text-gray-600">Deep understanding of Indian laws, procedures, and court systems</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Lawyers</h3>
              <p className="text-gray-600">All lawyers are verified with Bar Council credentials and client reviews</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 AI Support</h3>
              <p className="text-gray-600">Get instant legal guidance anytime in Hindi and English</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Experience the future of legal services in India. Connect with verified lawyers and get AI-powered guidance today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/user-login">
                <Button 
                  data-testid="cta-client-btn"
                  className="bg-white text-blue-700 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold shadow-lg"
                >
                  I'm a Client
                </Button>
              </Link>
              <Link to="/lawyer-login">
                <Button 
                  data-testid="cta-lawyer-btn"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-700 rounded-full px-8 py-3 font-semibold"
                >
                  I'm a Lawyer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}