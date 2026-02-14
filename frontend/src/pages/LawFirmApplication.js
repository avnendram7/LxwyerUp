import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Phone, Mail, MapPin, FileText, Users, CheckCircle, ArrowRight, ArrowLeft, Briefcase, Globe, Shield, Scale, CreditCard, Loader2, Check, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

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
            onClick={() => navigate('/lawfirm-role')}
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

// Subscription Plans Data
const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small firms',
    monthlyPrice: 4999,
    yearlyPrice: 49999,
    lawyers: 5,
    clients: 50,
    features: [
      'Up to 5 Lawyers',
      'Up to 50 Clients',
      'Basic Dashboard',
      'Email Support',
      'Case Management',
      'Client Portal'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing firms',
    monthlyPrice: 9999,
    yearlyPrice: 99999,
    lawyers: 15,
    clients: 200,
    features: [
      'Up to 15 Lawyers',
      'Up to 200 Clients',
      'Advanced Dashboard',
      'Priority Support',
      'Case Management',
      'Client Portal',
      'Analytics & Reports',
      'Document Management'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large law firms',
    monthlyPrice: 19999,
    yearlyPrice: 199999,
    lawyers: 50,
    clients: 'Unlimited',
    features: [
      'Up to 50 Lawyers',
      'Unlimited Clients',
      'Premium Dashboard',
      '24/7 Dedicated Support',
      'Advanced Case Management',
      'Client Portal',
      'Custom Analytics',
      'Document Management',
      'API Access',
      'White-label Option'
    ],
    popular: false
  }
];

export default function LawFirmApplication() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('professional');
  
  const [formData, setFormData] = useState({
    firm_name: '',
    registration_number: '',
    established_year: '',
    website: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_designation: '',
    password: '',
    confirm_password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    practice_areas: [],
    total_lawyers: '',
    total_staff: '',
    description: '',
    achievements: '',
    // Payment
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  const states = [
    "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat",
    "Uttar Pradesh", "Haryana", "West Bengal", "Telangana", "Rajasthan",
    "Punjab", "Kerala"
  ];

  const practiceAreas = [
    "Criminal Law", "Family Law", "Property Law", "Corporate Law",
    "Civil Law", "Tax Law", "Labour Law", "Intellectual Property",
    "Banking Law", "Consumer Law", "Immigration Law", "Environmental Law"
  ];

  const handlePracticeAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      practice_areas: prev.practice_areas.includes(area)
        ? prev.practice_areas.filter(a => a !== area)
        : [...prev.practice_areas, area]
    }));
  };

  const getSelectedPlanDetails = () => {
    return subscriptionPlans.find(p => p.id === selectedPlan);
  };

  const getPrice = () => {
    const plan = getSelectedPlanDetails();
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getGST = () => Math.round(getPrice() * 0.18);
  const getTotal = () => getPrice() + getGST();

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firm_name || !formData.registration_number || !formData.established_year) {
          toast.error('Please fill all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.contact_name || !formData.contact_email || !formData.contact_phone || !formData.password) {
          toast.error('Please fill all required fields');
          return false;
        }
        if (formData.password !== formData.confirm_password) {
          toast.error('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return false;
        }
        break;
      case 3:
        if (!formData.city || !formData.state || formData.practice_areas.length === 0) {
          toast.error('Please fill location and select at least one practice area');
          return false;
        }
        break;
      case 4:
        if (!formData.total_lawyers || !formData.description) {
          toast.error('Please fill all required fields');
          return false;
        }
        break;
      case 5:
        // Subscription plan - no validation needed
        break;
      case 6:
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardName) {
          toast.error('Please fill all payment details');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const processPayment = async () => {
    if (!validateStep()) return;
    
    setPaymentProcessing(true);
    
    // Simulate payment processing (3 seconds)
    setTimeout(async () => {
      try {
        await axios.post(`${API}/lawfirm-applications`, {
          firm_name: formData.firm_name,
          registration_number: formData.registration_number,
          established_year: parseInt(formData.established_year),
          website: formData.website,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          contact_designation: formData.contact_designation,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          practice_areas: formData.practice_areas,
          total_lawyers: parseInt(formData.total_lawyers),
          total_staff: parseInt(formData.total_staff) || 0,
          description: formData.description,
          achievements: formData.achievements,
          subscription_plan: selectedPlan,
          billing_cycle: billingCycle,
          subscription_amount: getTotal()
        });
        
        toast.success('Payment successful! Application submitted.');
        setPaymentProcessing(false);
        setStep(7); // Success step
      } catch (error) {
        setPaymentProcessing(false);
        const errorMsg = error.response?.data?.detail;
        if (typeof errorMsg === 'string') {
          toast.error(errorMsg);
        } else {
          toast.success('Payment successful!');
          setStep(7);
        }
      }
    }, 3000);
  };

  const steps = [
    { num: 1, title: 'Firm Details', icon: Building2 },
    { num: 2, title: 'Contact', icon: User },
    { num: 3, title: 'Location', icon: MapPin },
    { num: 4, title: 'Firm Info', icon: FileText },
    { num: 5, title: 'Plan', icon: Crown },
    { num: 6, title: 'Payment', icon: CreditCard }
  ];

  // Success Page
  if (step === 7) {
    const plan = getSelectedPlanDetails();
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <SimpleNavbar navigate={navigate} />
        <div className="pt-24 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 max-w-lg w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#0F2944] mb-3">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your law firm <strong>{formData.firm_name}</strong> has been registered successfully.
            </p>
            
            <div className="bg-[#0F2944]/5 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-[#0F2944] mb-3">Subscription Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-[#0F2944]">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium text-[#0F2944] capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lawyers Allowed</span>
                  <span className="font-medium text-[#0F2944]">Up to {plan.lawyers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clients Allowed</span>
                  <span className="font-medium text-[#0F2944]">{plan.clients}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold text-[#0F2944]">Amount Paid</span>
                  <span className="font-bold text-[#0F2944]">₹{getTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-[#0F2944]">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Our team will review your application</li>
                <li>• You'll receive approval email within 24-48 hours</li>
                <li>• Login with <strong>{formData.contact_email}</strong></li>
                <li>• Access your Law Firm Manager Dashboard</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/login')}
                className="flex-1 bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-gray-200 text-[#0F2944] hover:bg-gray-50 rounded-xl"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleNavbar navigate={navigate} />

      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2944] mb-3">Register Your Law Firm</h1>
          <p className="text-gray-600">Join India's leading legal platform and grow your practice</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center min-w-[60px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-[#0F2944] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-1 ${step >= s.num ? 'text-[#0F2944] font-medium' : 'text-gray-500'}`}>
                    {s.title}
                  </span>
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`w-8 h-1 mx-1 rounded ${step > s.num ? 'bg-[#0F2944]' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Firm Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Building2 className="w-8 h-8 text-[#0F2944]" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Firm Details</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Firm Name *</label>
                  <Input
                    value={formData.firm_name}
                    onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                    placeholder="e.g., Sharma & Associates"
                    className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Registration Number *</label>
                  <Input
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    placeholder="Bar Council Registration Number"
                    className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Established Year *</label>
                    <Input
                      type="number"
                      value={formData.established_year}
                      onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                      placeholder="e.g., 2010"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Website (Optional)</label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourfirm.com"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Person */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-8 h-8 text-[#0F2944]" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Contact Person</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Full Name *</label>
                    <Input
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="Contact person name"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Designation</label>
                    <Input
                      value={formData.contact_designation}
                      onChange={(e) => setFormData({ ...formData, contact_designation: e.target.value })}
                      placeholder="e.g., Managing Partner"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@yourfirm.com"
                    className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Phone *</label>
                  <Input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Password *</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Confirm Password *</label>
                    <Input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      placeholder="Re-enter password"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location & Practice */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-8 h-8 text-[#0F2944]" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Location & Practice Areas</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Office Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full office address"
                    className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Pincode</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="110001"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-3">Practice Areas * (Select all that apply)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {practiceAreas.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handlePracticeAreaToggle(area)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.practice_areas.includes(area)
                            ? 'bg-[#0F2944] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Firm Info */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-8 h-8 text-[#0F2944]" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Firm Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Total Lawyers *</label>
                    <Input
                      type="number"
                      value={formData.total_lawyers}
                      onChange={(e) => setFormData({ ...formData, total_lawyers: e.target.value })}
                      placeholder="Number of lawyers"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Total Staff</label>
                    <Input
                      type="number"
                      value={formData.total_staff}
                      onChange={(e) => setFormData({ ...formData, total_staff: e.target.value })}
                      placeholder="Support staff count"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">About Your Firm *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your firm's expertise, values, and approach..."
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2944] mb-2">Key Achievements (Optional)</label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="Notable cases won, awards, recognitions..."
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20 focus:border-[#0F2944]"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Subscription Plans */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <Crown className="w-12 h-12 text-[#0F2944] mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Choose Your Plan</h2>
                  <p className="text-gray-600">Select a subscription that fits your firm's needs</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 p-1 rounded-xl flex">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-white text-[#0F2944] shadow'
                          : 'text-gray-600 hover:text-[#0F2944]'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        billingCycle === 'yearly'
                          ? 'bg-white text-[#0F2944] shadow'
                          : 'text-gray-600 hover:text-[#0F2944]'
                      }`}
                    >
                      Yearly
                      <span className="ml-1 text-xs text-green-600 font-bold">Save 17%</span>
                    </button>
                  </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-[#0F2944] bg-[#0F2944]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#0F2944] text-white text-xs px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-[#0F2944]">{plan.name}</h3>
                        <p className="text-xs text-gray-500">{plan.description}</p>
                      </div>

                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold text-[#0F2944]">
                          ₹{(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Lawyers</span>
                          <span className="font-medium text-[#0F2944]">Up to {plan.lawyers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Clients</span>
                          <span className="font-medium text-[#0F2944]">{plan.clients}</span>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-xs text-[#0F2944] font-medium">
                            +{plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>

                      {selectedPlan === plan.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-[#0F2944]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 6: Payment */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-8 h-8 text-[#0F2944]" />
                  <h2 className="text-2xl font-bold text-[#0F2944]">Payment Details</h2>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#0F2944] mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getSelectedPlanDetails().name} Plan ({billingCycle})</span>
                      <span className="font-medium text-[#0F2944]">₹{getPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium text-[#0F2944]">₹{getGST().toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span className="font-bold text-[#0F2944]">Total</span>
                      <span className="font-bold text-xl text-[#0F2944]">₹{getTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Card Number *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                          setFormData({ ...formData, cardNumber: formatted });
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F2944] mb-2">Expiry Date *</label>
                      <Input
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          setFormData({ ...formData, cardExpiry: value });
                        }}
                        placeholder="MM/YY"
                        className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F2944] mb-2">CVV *</label>
                      <Input
                        value={formData.cardCvv}
                        onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        placeholder="123"
                        type="password"
                        className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F2944] mb-2">Cardholder Name *</label>
                    <Input
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      placeholder="Name on card"
                      className="bg-white border-gray-200 rounded-xl text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Your payment is secured with 256-bit SSL encryption</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6"
                disabled={paymentProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Link to="/lawfirm-role">
                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
            )}

            {step < 6 ? (
              <Button
                onClick={handleNext}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={processPayment}
                disabled={paymentProcessing}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-8"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${getTotal().toLocaleString()}`
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Already registered? </span>
          <Link to="/lawfirm-login" className="text-[#0F2944] hover:underline font-semibold">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
