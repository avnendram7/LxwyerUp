import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Scale, LogOut, LayoutDashboard, Calendar, MessageSquare, FileText, Send, User, Clock, MapPin, Shield, FileCheck, Mic, CheckCircle, Search, Gavel, AlertTriangle, ListChecks, BookOpen, TrendingUp, Video } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

// Legal Analysis Card Component
const LegalAnalysisCard = ({ icon: Icon, title, content, borderColor, bgColor }) => (
  <div className={`bg-white rounded-xl p-4 border-t-4 ${borderColor} shadow-md hover:shadow-lg transition-shadow`}>
    <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{content}</p>
  </div>
);

// Lawyer Recommendation Card Component
const LawyerCard = ({ name, specialization, experience, successRate, location, hourlyRate, onBook }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
        <User className="w-7 h-7 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <p className="text-sm text-blue-600 font-medium">{specialization}</p>
      <p className="text-sm text-gray-600">{experience} yrs • {successRate}% success</p>
      <p className="text-sm text-gray-500 flex items-center">
        <MapPin className="w-3 h-3 mr-1" />{location} • <span className="font-semibold text-gray-900 ml-1">₹{hourlyRate}/hr</span>
      </p>
    </div>
    <div className="flex gap-2">
      <Button onClick={onBook} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
        Book Appointment
      </Button>
      <Button variant="outline" className="border-gray-300 rounded-lg px-3">
        <Video className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  </div>
);

// Legal Sections Component
const LegalSectionsCard = ({ sections }) => (
  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 border border-blue-100">
    <div className="flex items-center space-x-2 mb-4">
      <BookOpen className="w-5 h-5 text-blue-600" />
      <h4 className="font-bold text-gray-900">Relevant Legal Sections</h4>
    </div>
    <div className="space-y-3">
      {sections.map((section, idx) => (
        <div key={idx} className="text-sm">
          <span className="font-semibold text-gray-900">{section.title}:</span>
          <span className="text-gray-600 ml-1">{section.description}</span>
        </div>
      ))}
    </div>
  </div>
);

// Parse AI response to detect if it's a legal query
const parseLegalResponse = (response) => {
  const lowerResponse = response.toLowerCase();

  // Keywords that indicate a legal case discussion
  const legalKeywords = ['section', 'ipc', 'bail', 'punishment', 'court', 'trial', 'offense', 'crime', 'murder', 'theft', 'fraud', 'property', 'divorce', 'custody', 'maintenance', 'cheque bounce', 'consumer', 'complaint', 'fir', 'cognizable', 'non-bailable', 'bailable', 'imprisonment', 'fine', 'hearing', 'advocate', 'lawyer'];

  const isLegalQuery = legalKeywords.some(keyword => lowerResponse.includes(keyword));

  if (!isLegalQuery) return null;

  // Try to extract case type from response
  let caseType = 'General Legal Matter';
  let severity = 'Moderate';
  let bailInfo = 'Depends on case specifics';
  let punishment = 'Varies based on offense';
  let timeline = '6-24 months typically';
  let crimeType = 'Civil/Criminal';
  let firstSteps = 'Consult a lawyer immediately';
  let sections = [];

  // Detect specific case types
  if (lowerResponse.includes('murder') || lowerResponse.includes('302')) {
    caseType = 'Murder under Section 302 IPC';
    severity = 'Extreme';
    bailInfo = 'Generally not granted';
    punishment = 'Life imprisonment or death penalty';
    timeline = '24-60 months';
    crimeType = 'Non-bailable, Cognizable';
    firstSteps = 'Immediate legal consultation, evidence preservation';
    sections = [
      { title: 'Section 302 - Murder', description: 'Punishment for murder - death or life imprisonment' },
      { title: 'Section 300 - Murder definition', description: 'Defines what constitutes murder' },
      { title: 'Section 304 - Culpable homicide', description: 'Not amounting to murder - up to 10 years' }
    ];
  } else if (lowerResponse.includes('theft') || lowerResponse.includes('379')) {
    caseType = 'Theft under Section 379 IPC';
    severity = 'Moderate';
    bailInfo = 'Generally granted';
    punishment = 'Up to 3 years imprisonment';
    timeline = '6-18 months';
    crimeType = 'Bailable, Cognizable';
    firstSteps = 'File FIR, gather evidence, consult lawyer';
    sections = [
      { title: 'Section 378 - Theft definition', description: 'Moving property without consent' },
      { title: 'Section 379 - Punishment', description: 'Up to 3 years imprisonment or fine' },
      { title: 'Section 380 - Theft in dwelling', description: 'Up to 7 years imprisonment' }
    ];
  } else if (lowerResponse.includes('divorce') || lowerResponse.includes('marriage') || lowerResponse.includes('custody')) {
    caseType = 'Family Law Matter';
    severity = 'Moderate';
    bailInfo = 'Not applicable (civil matter)';
    punishment = 'Alimony/Maintenance as per court';
    timeline = '12-36 months';
    crimeType = 'Civil Matter';
    firstSteps = 'Gather marriage documents, financial records';
    sections = [
      { title: 'Hindu Marriage Act', description: 'Governs Hindu marriages and divorce' },
      { title: 'Section 125 CrPC', description: 'Maintenance for wife, children' },
      { title: 'Domestic Violence Act', description: 'Protection against domestic abuse' }
    ];
  } else if (lowerResponse.includes('property') || lowerResponse.includes('land') || lowerResponse.includes('possession')) {
    caseType = 'Property Dispute';
    severity = 'Moderate';
    bailInfo = 'Generally granted if applicable';
    punishment = 'Civil remedies, possible criminal charges';
    timeline = '12-48 months';
    crimeType = 'Civil/Criminal';
    firstSteps = 'Verify documents, title search, legal notice';
    sections = [
      { title: 'Transfer of Property Act', description: 'Governs property transfers' },
      { title: 'Section 420 IPC', description: 'Cheating and dishonestly inducing delivery' },
      { title: 'Specific Relief Act', description: 'Recovery of possession' }
    ];
  } else if (lowerResponse.includes('consumer') || lowerResponse.includes('defect') || lowerResponse.includes('service')) {
    caseType = 'Consumer Complaint';
    severity = 'Low to Moderate';
    bailInfo = 'Not applicable (civil matter)';
    punishment = 'Compensation, refund, replacement';
    timeline = '3-12 months';
    crimeType = 'Civil Matter';
    firstSteps = 'Collect bills, complaint to company first';
    sections = [
      { title: 'Consumer Protection Act 2019', description: 'Rights of consumers' },
      { title: 'Section 2(7) - Consumer', description: 'Definition of consumer' },
      { title: 'Section 35 - District Forum', description: 'Filing complaints up to ₹1 crore' }
    ];
  } else if (lowerResponse.includes('bail') || lowerResponse.includes('anticipatory')) {
    caseType = 'Bail Application';
    severity = 'Varies';
    bailInfo = 'Depends on offense type';
    punishment = 'Not applicable';
    timeline = '1-4 weeks for hearing';
    crimeType = 'Procedural';
    firstSteps = 'Prepare bail application, surety arrangements';
    sections = [
      { title: 'Section 436 CrPC', description: 'Bail in bailable offenses' },
      { title: 'Section 437 CrPC', description: 'Bail in non-bailable offenses' },
      { title: 'Section 438 CrPC', description: 'Anticipatory bail' }
    ];
  } else if (lowerResponse.includes('cheque') || lowerResponse.includes('138') || lowerResponse.includes('dishonour')) {
    caseType = 'Cheque Bounce - Section 138 NI Act';
    severity = 'Moderate';
    bailInfo = 'Generally granted';
    punishment = 'Up to 2 years imprisonment or fine';
    timeline = '6-18 months';
    crimeType = 'Bailable, Compoundable';
    firstSteps = 'Send legal notice within 30 days of return';
    sections = [
      { title: 'Section 138 NI Act', description: 'Dishonor of cheque for insufficiency' },
      { title: 'Section 141 NI Act', description: 'Offenses by companies' },
      { title: 'Section 143 NI Act', description: 'Summary trial procedure' }
    ];
  }

  return {
    caseType,
    analysis: {
      bailInfo,
      punishment,
      timeline,
      crimeType,
      severity,
      firstSteps
    },
    sections
  };
};

// Dummy lawyers data
const dummyLawyers = [
  { id: 1, name: 'Dummy Recommended Lawyer', specialization: 'Criminal Defense', experience: 15, successRate: 95, location: 'Delhi', hourlyRate: 2500 }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [casesRes, docsRes, bookingsRes, lawyersRes, dashboardRes, messagesRes] = await Promise.all([
        axios.get(`${API}/cases`, { headers }),
        axios.get(`${API}/documents`, { headers }),
        axios.get(`${API}/bookings`, { headers }),
        axios.get(`${API}/lawyers`),
        axios.get(`${API}/dashboard/user`, { headers }),
        axios.get(`${API}/messages/recents`, { headers })
      ]);
      setCases(casesRes.data);
      setDocuments(docsRes.data);
      setBookings(bookingsRes.data);
      setLawyers(lawyersRes.data);
      setDashboardData(dashboardRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput, isStructured: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, { message: chatInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const aiResponse = response.data.response;
      const legalData = parseLegalResponse(aiResponse);

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        isStructured: !!legalData,
        legalData: legalData
      }]);
    } catch (error) {
      toast.error('Chat error');
      setChatMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const res = await axios.get(`${API}/messages/${chat.other_user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(res.data);
    } catch (error) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await axios.post(`${API}/messages`, {
        receiver_id: selectedChat.other_user_id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewMessage('');
      // Refresh chat (optimistic update or re-fetch)
      const res = await axios.get(`${API}/messages/${selectedChat.other_user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(res.data);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const exampleQuestions = [
    "What is Section 302 IPC?",
    "Explain anticipatory bail",
    "Property dispute rights",
    "Consumer complaint process"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">NyaaySathi</span>
              <p className="text-xs text-blue-600 font-medium">LEGAL PARTNER</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            data-testid="dashboard-nav-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            data-testid="consultation-nav-btn"
            onClick={() => setActiveTab('consultation')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'consultation'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Consultation</span>
          </button>

          <button
            data-testid="messages-nav-btn"
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </button>

          <button
            data-testid="chatbot-nav-btn"
            onClick={() => setActiveTab('chatbot')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chatbot'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">ChatBot</span>
          </button>

          <button
            data-testid="documents-nav-btn"
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'documents'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{user?.full_name || 'Client User'}</p>
              <p className="text-xs text-gray-500">Client Account</p>
            </div>
            <button
              data-testid="logout-btn"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.full_name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-lg">Active</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{cases.length}</h3>
                <p className="text-sm text-gray-500">Active Cases</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 rounded-lg">Pending</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{documents.length}</h3>
                <p className="text-sm text-gray-500">Documents Pending</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">Upcoming</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
                <p className="text-sm text-gray-500">Next Hearing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Events */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Consultations</h2>
                </div>
                {bookings.filter(b => b.status !== 'cancelled').length > 0 ? (
                  bookings.filter(b => b.status !== 'cancelled').map((booking, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{booking.lawyer_name || 'Lawyer'}</h4>
                        <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                      </div>
                      {booking.meet_link && (
                        <a href={booking.meet_link} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Join Meet</Button>
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No upcoming consultations
                  </div>
                )}
              </div>

              {/* Recommended Lawyers */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Lawyers</h2>
                <div className="space-y-4">
                  {lawyers.slice(0, 3).map((lawyer, idx) => (
                    <LawyerCard key={idx} {...lawyer} onBook={() => { }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Discussion Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Discussion Summary</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  The initial consultation covered the case background, key evidence, and established the preliminary legal strategy moving forward...
                </p>
                <button className="text-blue-600 text-sm font-semibold flex items-center space-x-1 hover:underline">
                  <span>View Full Summary</span>
                  <span>→</span>
                </button>
              </div>

              {/* Case Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Case Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600">Next hearing date scheduled</p>
                      <p className="text-xs text-gray-500">Jan 28, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Court discussion summary added</p>
                      <p className="text-xs text-gray-500">Jan 25, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Consultation completed</p>
                      <p className="text-xs text-gray-500">Jan 20, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Case filed</p>
                      <p className="text-xs text-gray-500">Jan 15, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Consultation Tab */}
        {activeTab === 'consultation' && (
          <div className="p-8 bg-white min-h-full">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Find Your Legal Expert</h1>

            {/* Consultation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600"
                  alt="Consultation"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Direct Consultation</h3>
                  <p className="text-gray-200 text-sm mb-4">Browse our directory of vetted lawyers. Filter by specialization, experience, and location to find your perfect match.</p>
                  <Button className="bg-white hover:bg-gray-100 text-gray-900 rounded-xl shadow-lg">
                    Find a Lawyer →
                  </Button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500 p-6 flex flex-col shadow-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">AI-Powered Recommendation</h3>
                <p className="text-blue-100 text-sm mb-4 flex-1">Answer a few questions and let our advanced AI match you with the best lawyer for your specific case instantly.</p>
                <Button className="bg-white hover:bg-gray-100 text-blue-700 rounded-xl shadow-lg">
                  Start Matching 🔒
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">End-to-End Encrypted</h4>
                <p className="text-gray-600 text-sm">Your privacy is guaranteed. No recordings, ever.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">PDF Transcripts</h4>
                <p className="text-gray-600 text-sm">Receive a searchable PDF transcript of your call.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-7 h-7 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Voice Assistant</h4>
                <p className="text-gray-600 text-sm">Easily navigate and control your call with voice.</p>
              </div>
            </div>

            {/* Recommended Lawyers */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Lawyers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dummyLawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer.id}
                  name={lawyer.name}
                  specialization={lawyer.specialization}
                  experience={lawyer.experience}
                  successRate={lawyer.successRate}
                  location={lawyer.location}
                  hourlyRate={lawyer.hourlyRate}
                  onBook={() => toast.success(`Booking request sent to ${lawyer.name}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ChatBot Tab - Enhanced with Legal Analysis Cards */}
        {activeTab === 'chatbot' && (
          <div className="h-full flex flex-col bg-gray-50">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1 text-white">Legal AI Assistant</h1>
                  <p className="text-blue-100 text-sm">24/7 Instant legal analysis and lawyer recommendations</p>
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30">PRO USER</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.map((msg, idx) => (
                <div key={idx}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-2xl rounded-2xl p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* AI Avatar and basic response */}
                      <div className="flex justify-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                          <Scale className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-3xl">
                          {!msg.isStructured ? (
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs text-gray-400 mt-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* AI Legal Analysis Header */}
                              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Legal Analysis</h3>
                                <p className="text-sm text-gray-600">{msg.legalData.caseType}</p>
                              </div>

                              {/* Analysis Cards Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <LegalAnalysisCard
                                  icon={Gavel}
                                  title="Bail Information"
                                  content={msg.legalData.analysis.bailInfo}
                                  borderColor="border-red-500"
                                  bgColor="bg-red-500"
                                />
                                <LegalAnalysisCard
                                  icon={Clock}
                                  title="Trial Timeline"
                                  content={msg.legalData.analysis.timeline}
                                  borderColor="border-green-500"
                                  bgColor="bg-green-500"
                                />
                                <LegalAnalysisCard
                                  icon={AlertTriangle}
                                  title="Punishment"
                                  content={msg.legalData.analysis.punishment}
                                  borderColor="border-orange-500"
                                  bgColor="bg-orange-500"
                                />
                                <LegalAnalysisCard
                                  icon={ListChecks}
                                  title="First Steps"
                                  content={msg.legalData.analysis.firstSteps}
                                  borderColor="border-blue-500"
                                  bgColor="bg-blue-500"
                                />
                                <LegalAnalysisCard
                                  icon={Shield}
                                  title="Crime Type"
                                  content={msg.legalData.analysis.crimeType}
                                  borderColor="border-purple-500"
                                  bgColor="bg-purple-500"
                                />
                                <LegalAnalysisCard
                                  icon={TrendingUp}
                                  title="Severity"
                                  content={msg.legalData.analysis.severity}
                                  borderColor="border-amber-500"
                                  bgColor="bg-amber-500"
                                />
                              </div>

                              {/* Recommended Lawyers */}
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Legal Experts</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {dummyLawyers.map((lawyer) => (
                                    <LawyerCard
                                      key={lawyer.id}
                                      name={lawyer.name}
                                      specialization={lawyer.specialization}
                                      experience={lawyer.experience}
                                      successRate={lawyer.successRate}
                                      location={lawyer.location}
                                      hourlyRate={lawyer.hourlyRate}
                                      onBook={() => toast.success(`Booking request sent to ${lawyer.name}`)}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Legal Sections */}
                              {msg.legalData.sections.length > 0 && (
                                <LegalSectionsCard sections={msg.legalData.sections} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Example Questions */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(q)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl text-sm text-blue-700 font-medium whitespace-nowrap border border-blue-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={handleChat} className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    data-testid="chatbot-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Describe your legal issue or ask a question..."
                    className="bg-gray-100 border-gray-200 rounded-xl py-6 pr-12 text-gray-800 placeholder-gray-500"
                    disabled={loading}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <Button
                  data-testid="chatbot-send-btn"
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl px-6 shadow-lg shadow-blue-200"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {
          activeTab === 'messages' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      End-to-End Encrypted
                    </span>
                  </div>
                  <p className="text-gray-500">Secure communication with your lawyers</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 shadow-lg shadow-blue-200">
                  + New Message
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input placeholder="Search conversations..." className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((chat, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectChat(chat)}
                          className={`flex items-center space-x-3 p-4 cursor-pointer transition-all ${selectedChat?.other_user_id === chat.other_user_id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}>
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 ${chat.avatar ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} rounded-full flex items-center justify-center shadow-sm`}>
                              <span className="font-bold">{chat.avatar || '?'}</span>
                            </div>
                            {chat.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-gray-900 truncate">{chat.name}</h4>
                              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                          </div>
                          {chat.unread > 0 && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No messages yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                              <span className="font-bold">{selectedChat.avatar || '?'}</span>
                            </div>
                            {selectedChat.online && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                            <p className="text-xs text-green-600">Online • Your Legal Counsel</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                            <ListChecks className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        <div className="flex items-center justify-center">
                          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">Today</span>
                        </div>

                        {chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex items-start space-x-3 ${msg.sender_id === user.id ? 'justify-end' : ''}`}>
                            {msg.sender_id !== user.id && (
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold">{selectedChat.avatar || '?'}</span>
                              </div>
                            )}
                            <div className={`max-w-[70%] ${msg.sender_id === user.id ? 'text-right' : ''}`}>
                              <div className={`p-4 shadow-sm rounded-2xl ${msg.sender_id === user.id
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                          <button type="button" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors pointer shadow-sm">
                            <span className="text-xl">📎</span>
                          </button>
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 border-gray-200 rounded-full px-5 text-gray-900"
                          />
                          <Button type="submit" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
                      <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Select a conversation</p>
                      <p className="text-sm">Choose a chat from the list to start messaging</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-8 bg-white min-h-full">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Documents</h1>

            {documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No documents uploaded yet.</p>
                <p className="text-gray-500 text-sm">Upload your first document to get started.</p>
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-200">
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold mb-2 text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">Type: {doc.file_type}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}
