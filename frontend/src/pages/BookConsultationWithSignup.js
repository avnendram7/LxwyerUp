import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, CreditCard, Check, ArrowRight, Shield, Lock, Scale, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

export default function BookConsultationWithSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedLawyer = location.state?.lawyer || null;

  const [signupData, setSignupData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    description: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!selectedLawyer) {
      toast.error('Please select a lawyer first');
      navigate('/find-lawyer');
    }
  }, [selectedLawyer, navigate]);

  if (!selectedLawyer) return null;

  // Extract fee from lawyer data (e.g., "₹5,000 - ₹15,000" -> 5000)
  const getFeeAmount = () => {
    if (selectedLawyer.consultation_fee) {
      return selectedLawyer.consultation_fee;
    }
    if (selectedLawyer.fee) {
      const feeStr = selectedLawyer.fee.toString();
      const match = feeStr.match(/₹?([\d,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    return 999; // Default fallback
  };

  const consultationFee = getFeeAmount();

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!signupData.full_name || !signupData.email || !signupData.phone || !signupData.password) {
      toast.error('Please fill all signup fields');
      return;
    }

    setStep(2); // Move to booking details
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select date and time');
      return;
    }

    setStep(3); // Move to payment
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create user account
      const userPayload = {
        ...signupData,
        user_type: 'client'
      };

      const signupResponse = await axios.post(`${API}/auth/signup`, userPayload);

      // Store token
      localStorage.setItem('token', signupResponse.data.token);
      localStorage.setItem('user', JSON.stringify(signupResponse.data.user));

      // Create booking
      const bookingPayload = {
        lawyer_id: selectedLawyer.id,
        lawyer_name: selectedLawyer.name,
        date: bookingData.date,
        time: bookingData.time,
        description: bookingData.description,
        amount: consultationFee,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'card',
        card_last_four: paymentData.cardNumber.slice(-4)
      };

      await axios.post(`${API}/bookings`, bookingPayload, {
        headers: { Authorization: `Bearer ${signupResponse.data.token}` }
      });

      toast.success('Account created and booking confirmed!');
      setStep(4); // Success

    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.detail?.includes('already exists')) {
        toast.error('Email already registered. Please login instead.');
        setTimeout(() => navigate('/user-login'), 2000);
      } else {
        toast.error(error.response?.data?.detail || 'Booking failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${step >= num ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                  {step > num ? <Check className="w-6 h-6" /> : num}
                </div>
                {num < 4 && (
                  <div className={`w-20 h-1 mx-2 transition-all ${step > num ? 'bg-blue-600' : 'bg-slate-800'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 text-sm text-slate-400 gap-16">
            <span className={step === 1 ? 'text-blue-400 font-semibold' : ''}>Signup</span>
            <span className={step === 2 ? 'text-blue-400 font-semibold' : ''}>Booking</span>
            <span className={step === 3 ? 'text-blue-400 font-semibold' : ''}>Payment</span>
            <span className={step === 4 ? 'text-blue-400 font-semibold' : ''}>Done</span>
          </div>
        </div>

        {/* Selected Lawyer Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-sm font-medium text-slate-400 mb-3">Selected Lawyer</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">{selectedLawyer.name}</h4>
              <p className="text-blue-400 text-sm">{selectedLawyer.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {selectedLawyer.experience} years
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedLawyer.city}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Consultation Fee</p>
              <p className="text-2xl font-bold text-white">₹{consultationFee}</p>
            </div>
          </div>
        </motion.div>

        {/* Step 1: Signup */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-slate-400 mb-8">Sign up to book consultation with {selectedLawyer.name}</p>

            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={signupData.full_name}
                    onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                    minLength="6"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue to Booking
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/user-login', { state: { lawyer: selectedLawyer } })}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Login
                </button>
              </p>
            </form>
          </motion.div>
        )}

        {/* Step 2: Booking Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Schedule Consultation</h2>
            <p className="text-slate-400 mb-8">Choose your preferred date and time</p>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Brief Description (Optional)</label>
                <textarea
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Tell us briefly about your legal matter..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Proceed to Payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Payment Details</h2>
            <p className="text-slate-400 mb-8">Complete your payment to confirm the booking</p>

            {/* Booking Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lawyer</span>
                  <span className="text-white font-medium">{selectedLawyer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="text-white font-medium">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client</span>
                  <span className="text-white font-medium">{signupData.full_name}</span>
                </div>
                <div className="border-t border-slate-700 mt-4 pt-4 flex justify-between">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-400">₹{consultationFee}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      if (value.length <= 16 && /^\d*$/.test(value)) {
                        setPaymentData({ ...paymentData, cardNumber: value });
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">For testing: Use 4242424242424242</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="JOHN DOE"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      if (value.length <= 5) {
                        setPaymentData({ ...paymentData, expiryDate: value });
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setPaymentData({ ...paymentData, cvv: value });
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium">Secure Payment</p>
                  <p className="text-slate-400">Your payment information is encrypted and secure</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${consultationFee}`}
                {!loading && <Lock className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-slate-400 mb-8">Your account has been created and consultation booking is confirmed</p>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Account & Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white font-medium">{signupData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lawyer</span>
                  <span className="text-white font-medium">{selectedLawyer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white font-medium">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time</span>
                  <span className="text-white font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="text-green-400 font-bold">₹{consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-slate-300 text-sm">
                ✅ You are now logged in! Access your dashboard to view booking details and track your case.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-xl transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
