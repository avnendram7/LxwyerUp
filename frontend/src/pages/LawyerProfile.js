import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale, Briefcase, MapPin, ArrowRight, ArrowLeft, Phone, Mail,
  GraduationCap, Languages, Calendar, CheckCircle, Award, Clock, Video, User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { dummyLawyers } from '../data/lawyersData';

const SimpleNavbar = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-[#0F2944]" />
            <span className="text-xl font-bold text-[#0F2944]">Lxwyer Up</span>
          </button>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-[#0F2944] hover:text-[#0F2944]/80"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/role-selection')}
              className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const LawyerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find the lawyer by ID
  const lawyer = dummyLawyers.find(l => l.id === id);

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <SimpleNavbar navigate={navigate} />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-[#0F2944]">Lawyer not found</h1>
          <Button onClick={() => navigate('/browse-lawyers')} className="mt-4">
            Browse Lawyers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/browse-lawyers')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0F2944] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lawyers
          </button>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                {lawyer.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0F2944] mb-2">{lawyer.name}</h1>
                    <p className="text-lg text-gray-600 mb-3">{lawyer.specialization}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{lawyer.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{lawyer.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fee Range */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="text-2xl font-bold text-[#0F2944]">₹{lawyer.feeMin} - ₹{lawyer.feeMax}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {lawyer.verified && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {lawyer.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <Award className="w-3 h-3" /> Featured
                    </span>
                  )}

                </div>
              </div>
            </div>

            {/* Book Consultation Button */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                onClick={() => navigate(`/booking/${lawyer.id}`)}
                className="w-full md:w-auto bg-[#0F2944] hover:bg-[#0F2944]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg group"
              >
                Book Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-6"
            >
              {/* About */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{lawyer.bio}</p>
              </div>

              {/* Specializations */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Practice Areas</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-[#0F2944] text-white rounded-full text-sm font-medium">
                    {lawyer.specialization}
                  </span>
                  {lawyer.secondarySpecializations?.map((spec, idx) => (
                    <span key={idx} className="px-4 py-2 bg-[#0F2944]/10 text-[#0F2944] rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Experience</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-3xl font-bold text-[#0F2944]">{lawyer.experience}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Contact Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F2944]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#0F2944]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-[#0F2944] font-medium">{lawyer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F2944]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#0F2944]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-[#0F2944] font-medium">{lawyer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F2944]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#0F2944]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-[#0F2944] font-medium">{lawyer.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Education</h2>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#0F2944] mt-0.5" />
                  <p className="text-gray-600">{lawyer.education}</p>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages?.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Consultation Modes */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Consultation Modes</h2>
                <div className="space-y-2">
                  {lawyer.consultationModes?.map((mode, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                      {mode === 'In-Person' && <User className="w-4 h-4" />}
                      {mode === 'Video Call' && <Video className="w-4 h-4" />}
                      {mode === 'Phone' && <Phone className="w-4 h-4" />}
                      <span>{mode}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Court */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F2944] mb-4">Primary Court</h2>
                <p className="text-gray-600">{lawyer.court}</p>
                <p className="text-xs text-gray-500 mt-1">Bar Council: {lawyer.barCouncilNumber}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
