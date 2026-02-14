import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, User, Mail, Phone, Lock, MapPin, Briefcase, GraduationCap, Languages, IndianRupee, FileText, Camera, CheckCircle, ArrowLeft, Loader2, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { dummyLawFirms } from '../data/lawFirmsDataExtended';

const states = ["Delhi", "Uttar Pradesh", "Haryana", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Telangana", "Punjab", "Rajasthan", "Kerala"];
const citiesByState = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Ghaziabad", "Varanasi", "Kanpur"],
  "Haryana": ["Gurugram", "Faridabad", "Chandigarh", "Rohtak"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
  "Telangana": ["Hyderabad", "Secunderabad", "Warangal"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"]
};
const courtsByState = {
  "Delhi": ["Delhi High Court", "Tis Hazari Courts", "Saket District Court", "Patiala House Court"],
  "Uttar Pradesh": ["Allahabad High Court", "District Court Lucknow", "Gautam Budh Nagar District Court"],
  "Haryana": ["Punjab & Haryana High Court", "Gurugram District Court", "Faridabad District Court"],
  "Maharashtra": ["Bombay High Court", "Pune District Court", "NCLT Mumbai"],
  "Karnataka": ["Karnataka High Court", "Bangalore City Civil Court"],
  "Tamil Nadu": ["Madras High Court", "Chennai City Civil Court"],
  "Gujarat": ["Gujarat High Court", "City Civil Court Ahmedabad"],
  "West Bengal": ["Calcutta High Court", "City Civil Court Kolkata"],
  "Telangana": ["Telangana High Court", "City Civil Court Hyderabad"],
  "Punjab": ["Punjab and Haryana High Court", "District Court Chandigarh"],
  "Rajasthan": ["Rajasthan High Court", "District Court Jaipur"],
  "Kerala": ["Kerala High Court", "District Court Kochi"]
};
const specializations = [
  "Criminal Law", "Family Law", "Property Law", "Corporate Law", "Civil Law",
  "Cyber Law", "Tax Law", "Labour Law", "Constitutional Law", "Consumer Law",
  "Banking Law", "Immigration Law", "Intellectual Property", "Medical Negligence", "Environmental Law"
];
const languageOptions = ["Hindi", "English", "Marathi", "Punjabi", "Gujarati", "Tamil", "Telugu", "Bengali", "Kannada", "Malayalam", "Urdu"];

const SimpleNavbar = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-[#0F2944]" />
            <span className="text-xl font-bold text-[#0F2944]">Lxwyer Up</span>
          </button>
          
          <button
            onClick={() => navigate('/role-selection')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0F2944] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </nav>
  );
};

export default function LawyerApplication() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lawFirms, setLawFirms] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    photo: '',
    lawyerType: '', // 'independent' or 'law_firm'
    lawFirmId: '',
    lawFirmName: '',
    barCouncilNumber: '',
    specialization: '',
    experience: '',
    casesWon: '',
    state: '',
    city: '',
    court: '',
    education: '',
    languages: [],
    feeMin: '',
    feeMax: '',
    bio: ''
  });

  useEffect(() => {
    // Fetch law firms from API or use dummy data
    const fetchLawFirms = async () => {
      try {
        const response = await axios.get(`${API}/lawfirms`);
        if (response.data && response.data.length > 0) {
          setLawFirms([...response.data, ...dummyLawFirms]);
        } else {
          setLawFirms(dummyLawFirms);
        }
      } catch (error) {
        setLawFirms(dummyLawFirms);
      }
    };
    fetchLawFirms();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        toast.error('Please fill all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (!formData.lawyerType) {
        toast.error('Please select if you are Independent or Law Firm Associate');
        return false;
      }
      if (formData.lawyerType === 'law_firm' && !formData.lawFirmId) {
        toast.error('Please select your law firm');
        return false;
      }
    }
    if (stepNum === 2) {
      if (!formData.barCouncilNumber || !formData.specialization || !formData.experience) {
        toast.error('Please fill all required fields');
        return false;
      }
    }
    if (stepNum === 3) {
      if (!formData.state || !formData.city || !formData.court) {
        toast.error('Please select your location details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.education || formData.languages.length === 0 || !formData.bio) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/lawyer-applications`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        photo: formData.photo || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg`,
        lawyer_type: formData.lawyerType,
        law_firm_id: formData.lawyerType === 'law_firm' ? formData.lawFirmId : null,
        law_firm_name: formData.lawyerType === 'law_firm' ? formData.lawFirmName : null,
        bar_council_number: formData.barCouncilNumber,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        cases_won: parseInt(formData.casesWon) || 0,
        state: formData.state,
        city: formData.city,
        court: formData.court,
        education: formData.education,
        languages: formData.languages,
        fee_range: `₹${formData.feeMin} - ₹${formData.feeMax}`,
        bio: formData.bio
      });
      
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <SimpleNavbar navigate={navigate} />
        <div className="pt-24 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#0F2944] mb-3">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for applying to join Lxwyer Up. Our team will review your application and get back to you within 24-48 hours.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-[#0F2944]">
                <strong>Application Type:</strong> {formData.lawyerType === 'independent' ? 'Independent Lawyer' : 'Law Firm Associate'}
              </p>
              {formData.lawyerType === 'law_firm' && (
                <p className="text-sm text-[#0F2944] mt-1">
                  <strong>Law Firm:</strong> {formData.lawFirmName}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Once approved, you can login with <strong>{formData.email}</strong> to access your {formData.lawyerType === 'independent' ? 'personal lawyer' : 'law firm'} dashboard.
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/')}
              className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-8"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />

      <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                s === step ? 'bg-[#0F2944] text-white' :
                s < step ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && (
                <div className={`w-16 h-1 mx-2 rounded ${
                  s < step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6"
        >
          {/* Step 1: Personal Info + Lawyer Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F2944]">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Adv. Rajesh Kumar"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="advocate@example.com"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Lawyer Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-3">Are you an Independent Lawyer or Law Firm Associate? *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        updateField('lawyerType', 'independent');
                        updateField('lawFirmId', '');
                        updateField('lawFirmName', '');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.lawyerType === 'independent'
                          ? 'border-[#0F2944] bg-[#0F2944]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <User className={`w-8 h-8 ${formData.lawyerType === 'independent' ? 'text-[#0F2944]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.lawyerType === 'independent' ? 'text-[#0F2944]' : 'text-gray-600'}`}>
                        Independent Lawyer
                      </span>
                      <span className="text-xs text-gray-500 text-center">Personal practice</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateField('lawyerType', 'law_firm')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.lawyerType === 'law_firm'
                          ? 'border-[#0F2944] bg-[#0F2944]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 ${formData.lawyerType === 'law_firm' ? 'text-[#0F2944]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.lawyerType === 'law_firm' ? 'text-[#0F2944]' : 'text-gray-600'}`}>
                        Law Firm Associate
                      </span>
                      <span className="text-xs text-gray-500 text-center">Working with a firm</span>
                    </button>
                  </div>
                </div>

                {/* Law Firm Selection (if law_firm type selected) */}
                {formData.lawyerType === 'law_firm' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Select Your Law Firm *</label>
                    <select
                      value={formData.lawFirmId}
                      onChange={(e) => {
                        const selectedFirm = lawFirms.find(f => f.id === e.target.value);
                        updateField('lawFirmId', e.target.value);
                        updateField('lawFirmName', selectedFirm?.firm_name || '');
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                    >
                      <option value="">Select a law firm</option>
                      {lawFirms.map(firm => (
                        <option key={firm.id} value={firm.id}>
                          {firm.firm_name} - {firm.city}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Don't see your firm? Ask your firm admin to register on Lxwyer Up first.
                    </p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Profile Photo URL (Optional)</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.photo}
                      onChange={(e) => updateField('photo', e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F2944]">Professional Details</h2>
                <p className="text-gray-600">Tell us about your legal practice</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Bar Council Registration Number *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.barCouncilNumber}
                      onChange={(e) => updateField('barCouncilNumber', e.target.value)}
                      placeholder="D/1234/2015"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Specialization *</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => updateField('specialization', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Years of Experience *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => updateField('experience', e.target.value)}
                        placeholder="10"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Cases Won (Approx)</label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.casesWon}
                        onChange={(e) => updateField('casesWon', e.target.value)}
                        placeholder="150"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F2944]">Practice Location</h2>
                <p className="text-gray-600">Where do you practice law?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      updateField('state', e.target.value);
                      updateField('city', '');
                      updateField('court', '');
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                    disabled={!formData.state}
                  >
                    <option value="">Select City</option>
                    {formData.state && citiesByState[formData.state]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Primary Court *</label>
                  <select
                    value={formData.court}
                    onChange={(e) => updateField('court', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                    disabled={!formData.state}
                  >
                    <option value="">Select Court</option>
                    {formData.state && courtsByState[formData.state]?.map(court => (
                      <option key={court} value={court}>{court}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Info */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F2944]">Additional Information</h2>
                <p className="text-gray-600">Complete your profile</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Education & Qualifications *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.education}
                      onChange={(e) => updateField('education', e.target.value)}
                      placeholder="LLB from Delhi University, LLM from NLS"
                      className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Languages *</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.languages.includes(lang)
                            ? 'bg-[#0F2944] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Consultation Fee Range *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.feeMin}
                        onChange={(e) => updateField('feeMin', e.target.value)}
                        placeholder="Min (e.g., 3000)"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.feeMax}
                        onChange={(e) => updateField('feeMax', e.target.value)}
                        placeholder="Max (e.g., 10000)"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Professional Bio *</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Write a brief description about your practice, expertise, and achievements..."
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-8"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Info Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By submitting, you agree to our verification process. Applications are typically reviewed within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
