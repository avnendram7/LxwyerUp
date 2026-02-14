import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Scale, LogOut, LayoutDashboard, Calendar as CalendarIcon, MessageSquare, FileText, Users, TrendingUp, Search, MoreVertical, User, Clock, Phone, Video, CheckCircle, AlertCircle, Archive, Shield, ChevronLeft, ChevronRight, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  isToday, parseISO
} from 'date-fns';
import axios from 'axios';
import { API } from '../App';

export default function LawyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [networkChat, setNetworkChat] = useState([]);
  const [newNetworkMessage, setNewNetworkMessage] = useState('');

  const token = localStorage.getItem('token');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [dashboardData, setDashboardData] = useState({
    stats: { active_cases: 0, total_clients: 0, consultations_this_month: 0, revenue: 0 },
    upcoming_hearings: [],
    recent_clients: []
  });

  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // New Case State
  const [newCaseData, setNewCaseData] = useState({
    title: '', client_name: '', case_type: '', court: '', status: 'active'
  });

  // New Event State
  const [newEventData, setNewEventData] = useState({
    title: '', type: 'meeting', start_time: '', end_time: '', description: ''
  });

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocForShare, setSelectedDocForShare] = useState(null);
  const [shareSearchQuery, setShareSearchQuery] = useState('');
  const [hasUploadPermission, setHasUploadPermission] = useState(false);

  // Deletion State
  const [docToDelete, setDocToDelete] = useState(null);

  // Fallbacks to prevent crashes while features are being built
  const [documents, setDocuments] = useState([]);
  const billingHistory = [];
  const networkMessages = [];

  // Use fetched cases or empty array
  const activeCases = cases || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSafe = async (name, url, setter) => {
      try {
        const res = await axios.get(url, { headers });
        setter(res.data);
        return { success: true, name };
      } catch (e) {
        console.error(`Failed to fetch ${name}:`, e);
        return { success: false, name, error: e };
      }
    };

    const results = await Promise.all([
      fetchSafe('cases', `${API}/cases`, setCases),
      fetchSafe('bookings', `${API}/bookings`, setBookings),
      fetchSafe('dashboard', `${API}/dashboard/lawyer`, setDashboardData),
      fetchSafe('messages', `${API}/messages/recents`, setMessages),
      fetchSafe('events', `${API}/events`, (data) => setEvents(data || [])),
      fetchSafe('notifications', `${API}/notifications`, setNotifications),
      fetchSafe('documents', `${API}/documents`, setDocuments)
    ]);

    const failures = results.filter(r => !r.success);
    if (failures.length === results.length) {
      toast.error("Dashboard failed to load. Please check your connection.");
    } else if (failures.length > 0) {
      const failedNames = failures.map(f => f.name).join(', ');
      console.warn(`Partial load failure: ${failedNames}`);
      // Don't spam toasts for minor failures if some data loaded
      if (failures.find(f => f.name === 'dashboard' || f.name === 'cases')) {
        toast.error(`Some critical data failed to load: ${failedNames}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.patch(`${API}/bookings/${bookingId}/status`, { status: 'confirmed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Booking confirmed!");
      fetchData();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to accept booking");
    }
  };

  const handleCancelBooking = async (bookingId, reason = "") => {
    try {
      await axios.patch(`${API}/bookings/${bookingId}/cancel`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Booking cancelled");
      fetchData();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleRescheduleBooking = async () => {
    if (!selectedBookingForReschedule || !rescheduleData.date || !rescheduleData.time) return;
    try {
      await axios.patch(`${API}/bookings/${selectedBookingForReschedule.id}/reschedule`, rescheduleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Booking rescheduled!");
      setShowRescheduleModal(false);
      fetchData();
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error("Failed to reschedule");
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.patch(`${API}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    // Optional: formData.append('case_id', 'some_id');

    setLoading(true);
    console.log("Starting document upload for:", file.name);

    try {
      await axios.post(`${API}/documents/upload`, formData, {
        timeout: 45000, // 45 seconds timeout
        headers: {
          Authorization: `Bearer ${token}`
          // Let Axios handle Content-Type boundary for multipart/form-data
        }
      });
      toast.success("Document uploaded successfully!");
      fetchData();
    } catch (error) {
      console.error("Error uploading document:", error);
      const msg = error.response?.data?.detail || error.message || "Failed to upload document";
      toast.error(msg);
      if (error.code === 'ECONNABORTED') {
        toast.error("Upload timed out. Is the file too large?");
      }
    } finally {
      setLoading(false);
      // Reset the file input so the same file can be selected again if needed
      e.target.value = null;
    }
  };

  const handleDeleteDocument = (docId) => {
    const doc = documents.find(d => d.id === docId);
    setDocToDelete(doc);
  };

  const confirmDeleteDocument = async () => {
    if (!docToDelete) return;

    try {
      await axios.delete(`${API}/documents/${docToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(prev => prev.filter(doc => doc.id !== docToDelete.id));
      toast.success('Document deleted successfully');
      setDocToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleShareDocument = async (clientId) => {
    if (!selectedDocForShare) return;

    const formData = new FormData();
    formData.append('client_id', clientId);

    setLoading(true);
    try {
      await axios.post(`${API}/documents/${selectedDocForShare.id}/share`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Document shared successfully!");
      setShowShareModal(false);
      fetchData();
    } catch (error) {
      console.error("Error sharing document:", error);
      toast.error("Failed to share document");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      await axios.patch(`${API}/bookings/${bookingId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Booking ${status}!`);

      fetchData();
    } catch (error) {
      toast.error("Failed to update booking status");
      setLoading(false);
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/cases`, newCaseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Case created successfully!");
      setShowCaseModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create case");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      // Ensure dates are ISO strings
      // If using datetime-local input, they are "YYYY-MM-DDTHH:MM"
      await axios.post(`${API}/events`, {
        ...newEventData,
        start_time: new Date(newEventData.start_time).toISOString(),
        end_time: new Date(newEventData.end_time).toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event added to calendar!");
      setShowEventModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to add event");
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

  const fetchNetworkMessages = async () => {
    try {
      const res = await axios.get(`${API}/network/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNetworkChat(res.data);
    } catch (error) {
      console.error("Error fetching network messages", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'network') {
      fetchNetworkMessages();
      const interval = setInterval(fetchNetworkMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleSendNetworkMessage = async (e) => {
    e.preventDefault();
    if (!newNetworkMessage.trim()) return;

    try {
      await axios.post(`${API}/network/messages`, {
        content: newNetworkMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewNetworkMessage('');
      fetchNetworkMessages();
    } catch (error) {
      toast.error('Failed to send message to network');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0F2944] rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold block text-[#0F2944]">Lxwyer Up</span>
              <span className="text-xs text-blue-600">LEGAL PARTNER</span>
            </div>
          </div>
        </div>

        {/* Menu Label */}
        <div className="px-6 py-3">
          <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">MENU</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <button
            data-testid="lawyer-dashboard-nav"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            data-testid="lawyer-cases-nav"
            onClick={() => setActiveTab('cases')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'cases'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Cases</span>
          </button>

          <button
            data-testid="lawyer-calendar-nav"
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'calendar'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="font-medium">Calendar</span>
          </button>

          <button
            data-testid="lawyer-messages-nav"
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'messages'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </button>

          <button
            data-testid="lawyer-documents-nav"
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'documents'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </button>

          <button
            data-testid="lawyer-network-nav"
            onClick={() => setActiveTab('network')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'network'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Lawyer Network</span>
            <span className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
          </button>

          <button
            data-testid="lawyer-earnings-nav"
            onClick={() => setActiveTab('earnings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'earnings'
              ? 'bg-[#0F2944] text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F2944]'
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Earnings</span>
          </button>
        </nav>

        {/* New Case Button */}
        <div className="p-4">
          <Button
            onClick={() => setShowCaseModal(true)}
            className="w-full bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl py-6"
          >
            <span className="mr-2 text-2xl">+</span> New Case
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">L</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0F2944]">{user?.full_name || 'Lawyer'}</p>
              <p className="text-xs text-gray-500">Criminal Law</p>
            </div>
            <button
              data-testid="lawyer-logout-btn"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-green-600 flex items-center mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {format(new Date(), 'EEEE, MMMM d')}
                </p>
                <h1 className="text-4xl font-bold text-[#0F2944]">
                  Good Morning, <span className="text-blue-600">{user?.full_name || 'Lawyer'}</span>
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                  <Search className="w-5 h-5 text-gray-500" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all relative shadow-sm"
                  >
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></span>
                    )}
                    <span className="text-xl">🔔</span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-[#0F2944]">Notifications</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          {notifications.filter(n => !n.is_read).length} New
                        </span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n, idx) => (
                            <div
                              key={idx}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                              onClick={() => !n.is_read && markNotificationRead(n.id)}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-bold text-sm text-[#0F2944]">{n.title}</p>
                                <span className="text-[10px] text-gray-400 capitalize">{n.type.replace('booking_', '')}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-3">{n.message}</p>

                              {n.type === 'booking_request' && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAcceptBooking(n.related_id); }}
                                    className="flex-1 bg-green-600 text-white text-[10px] py-1.5 rounded-lg hover:bg-green-700 font-bold"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const b = bookings.find(bk => bk.id === n.related_id);
                                      setSelectedBookingForReschedule(b);
                                      setShowRescheduleModal(true);
                                      setShowNotifications(false);
                                    }}
                                    className="flex-1 bg-amber-500 text-white text-[10px] py-1.5 rounded-lg hover:bg-amber-600 font-bold"
                                  >
                                    Reschedule
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCancelBooking(n.related_id, "Declined by lawyer"); }}
                                    className="flex-1 bg-red-100 text-red-600 text-[10px] py-1.5 rounded-lg hover:bg-red-200 font-bold"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-400 text-sm">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowCaseModal(true)}
                  className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6"
                >
                  + New Case
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Cases</p>
                    <h3 className="text-4xl font-bold text-[#0F2944]">{dashboardData.stats.active_cases}</h3>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-blue-600 font-semibold">+New This Month</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 shadow-lg relative overflow-hidden group transition-all"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Clients</p>
                    <h3 className="text-4xl font-bold text-[#0F2944]">{dashboardData.stats.total_clients}</h3>
                  </div>
                </div>
                <div className="flex items-center text-sm relative z-10">
                  <span className="text-amber-600 font-semibold">Active Clients</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 shadow-lg relative overflow-hidden group transition-all"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-white">₹</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Consultations</p>
                    <h3 className="text-4xl font-bold text-[#0F2944]">{dashboardData.stats.consultations_this_month}</h3>
                  </div>
                </div>
                <div className="flex items-center text-sm relative z-10">
                  <span className="text-green-600 font-semibold">Scheduled Appointments</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Schedule and Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F2944] mb-1">Today's Schedule</h2>
                    {(() => {
                      const todayStr = format(new Date(), 'yyyy-MM-dd');
                      const todayItems = [
                        ...(dashboardData.upcoming_hearings || []).map(h => ({ ...h, sessionType: 'HEARING' })),
                        ...(events || []).map(e => ({ ...e, date: (e.date || e.start_time?.split('T')[0]), sessionType: 'EVENT', case: e.title, court: e.description || e.type }))
                      ].filter(item => item.date === todayStr);

                      return (
                        <p className="text-sm text-gray-500">
                          You have {todayItems.length} items scheduled for today
                        </p>
                      );
                    })()}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const todayStr = format(new Date(), 'yyyy-MM-dd');
                    const todayItems = [
                      ...(dashboardData.upcoming_hearings || []).map(h => ({ ...h, sessionType: 'HEARING' })),
                      ...(events || []).map(e => ({ ...e, date: (e.date || e.start_time?.split('T')[0]), sessionType: 'EVENT', case: e.title, court: e.description || e.type }))
                    ].filter(item => item.date === todayStr)
                      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

                    return todayItems.length > 0 ? (
                      todayItems.map((session, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={idx}
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${idx === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-100'
                            } hover:shadow-md hover:-translate-y-1`}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-1 h-12 rounded-full ${session.sessionType === 'HEARING' ? 'bg-red-500' : 'bg-purple-500'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-lg text-[#0F2944]">{session.time || 'All Day'}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${session.sessionType === 'HEARING' ? 'text-red-600' : 'text-purple-600'}`}>{session.sessionType}</p>
                              </div>
                              <div className="text-right flex-1 px-4">
                                <p className="font-semibold text-[#0F2944]">{session.case}</p>
                                <p className="text-xs text-gray-500">{session.court}</p>
                              </div>
                              {idx === 0 && (
                                <Button className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-lg px-4 py-2 text-sm shadow-lg">
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No items scheduled for today.
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Messages - Now showing Recent Clients */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0F2944]">Recent Clients</h2>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {dashboardData.recent_clients && dashboardData.recent_clients.length > 0 ? (
                    dashboardData.recent_clients.map((client, idx) => (
                      <div key={idx} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white font-bold`}>
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#0F2944]">{client.name}</p>
                            <p className="text-xs text-gray-500 tracking-wide">{client.case}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {client.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">No recent clients found</div>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-6 border-gray-200 text-[#0F2944] hover:bg-gray-50 rounded-xl py-3">
                  View All Clients →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cases Tab - Dark Theme */}
        {activeTab === 'cases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#0F2944]">Case Management</h1>
                <p className="text-gray-500">Track your active cases, clients, and legal proceedings.</p>
              </div>
              <Button
                onClick={() => setShowCaseModal(true)}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6 shadow-lg shadow-blue-900/20"
              >
                + New Case
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center space-x-3 mb-3 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#0F2944]">{activeCases.length}</h3>
                    <p className="text-xs text-gray-500 uppercase">Total Cases</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 relative z-10">All Time</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center space-x-3 mb-3 relative z-10">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#0F2944]">{activeCases.filter(c => c.status === 'active').length}</h3>
                    <p className="text-xs text-gray-500 uppercase">Active</p>
                  </div>
                </div>
                <p className="text-xs text-green-600 relative z-10">Current</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center space-x-3 mb-3 relative z-10">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#0F2944]">{activeCases.filter(c => c.status === 'pending').length}</h3>
                    <p className="text-xs text-gray-500 uppercase">Pending</p>
                  </div>
                </div>
                <p className="text-xs text-amber-600 relative z-10">Needs Action</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-100 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center space-x-3 mb-3 relative z-10">
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#0F2944]">{activeCases.filter(c => c.status === 'closed').length}</h3>
                    <p className="text-xs text-gray-500 uppercase">Archived</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 relative z-10">Closed</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search cases, clients..."
                  className="pl-10 bg-white border-gray-200 rounded-xl text-[#0F2944] placeholder-gray-400 focus:ring-2 focus:ring-[#0F2944]/20"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="mr-2">⚙️</span> Filter
                </Button>
                <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2944]/20">
                  <option>Sort by Date</option>
                </select>
              </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Details</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCases.length > 0 ? (
                    activeCases.map((caseItem) => (
                      <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#0F2944]">{caseItem.title}</p>
                          <p className="text-sm text-gray-500">👤 {caseItem.client_name || 'Unknown'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{caseItem.case_type || 'General'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(caseItem.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${caseItem.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                            caseItem.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-[#0F2944] transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No active cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#0F2944] mb-2">Calendar</h1>
                <p className="text-gray-500">Manage your hearings, consultations and appointments</p>
              </div>
              <Button
                onClick={() => setShowEventModal(true)}
                className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6 shadow-lg shadow-blue-900/20"
              >
                + Add Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0F2944]">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const now = new Date();
                        setCurrentMonth(now);
                        setSelectedDate(now);
                      }}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const monthStart = startOfMonth(currentMonth);
                    const monthEnd = endOfMonth(monthStart);
                    const startDate = startOfWeek(monthStart);
                    const endDate = endOfWeek(monthEnd);
                    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                    return calendarDays.map((day) => {
                      const normalizedEvents = events.map(e => ({
                        ...e,
                        date: e.start_time.split('T')[0], // Extract YYYY-MM-DD
                        type: 'event'
                      }));

                      const dayDateStr = format(day, 'yyyy-MM-dd');
                      const dayEvents = [...(dashboardData.upcoming_hearings || []), ...bookings, ...normalizedEvents].filter(event => {
                        const eventRawDate = event.date || event.start_time || '';
                        const eventDateStr = eventRawDate.split('T')[0];
                        return eventDateStr === dayDateStr;
                      });
                      const hasHearing = dayEvents.some(e => e.court);
                      const hasBooking = dayEvents.some(e => !e.court && e.type !== 'event');
                      const hasEvent = dayEvents.some(e => e.type === 'event');

                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            aspect-square p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative group
                            ${!isSameMonth(day, monthStart) ? 'text-gray-300 bg-gray-50/50' : 'text-gray-700 hover:bg-gray-50'}
                            ${isSameDay(day, selectedDate) ? 'bg-[#0F2944] text-white hover:bg-[#0F2944] shadow-md transform scale-105' : ''}
                            ${isToday(day) && !isSameDay(day, selectedDate) ? 'border border-blue-200 bg-blue-50 text-blue-700' : ''}
                          `}
                        >
                          <span className={`text-sm font-medium ${isSameDay(day, selectedDate) ? 'text-white' : ''}`}>
                            {format(day, 'd')}
                          </span>

                          <div className="flex space-x-1 mt-1">
                            {hasHearing && (
                              <div className={`w-1.5 h-1.5 rounded-full ${isSameDay(day, selectedDate) ? 'bg-red-400' : 'bg-red-500'}`}></div>
                            )}
                            {hasBooking && (
                              <div className={`w-1.5 h-1.5 rounded-full ${isSameDay(day, selectedDate) ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                            )}
                            {hasEvent && (
                              <div className={`w-1.5 h-1.5 rounded-full ${isSameDay(day, selectedDate) ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Selected Day Schedule */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold text-[#0F2944] mb-4">
                  Schedule for {format(selectedDate, 'MMM d, yyyy')}
                </h3>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px]">
                  {(() => {
                    const hearingEvents = (dashboardData.upcoming_hearings || []).map(h => ({ ...h, type: 'hearing' }));
                    const bookingEvents = bookings.map(b => ({ ...b, type: 'booking' }));
                    const customEvents = events.map(e => ({
                      ...e,
                      type: 'event',
                      date: e.start_time.split('T')[0],
                      time: new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));

                    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
                    const daysEvents = [...hearingEvents, ...bookingEvents, ...customEvents]
                      .filter(event => {
                        const eventRawDate = event.date || event.start_time || '';
                        const eventDateStr = eventRawDate.split('T')[0];
                        return eventDateStr === selectedDateStr;
                      })
                      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

                    if (daysEvents.length === 0) {
                      return (
                        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <CalendarIcon className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500">No events scheduled.</p>
                          <Button
                            variant="outline"
                            onClick={() => setShowEventModal(true)}
                            className="mt-4 border-dashed border-gray-300 text-gray-500 hover:text-[#0F2944] hover:bg-gray-50"
                          >
                            + Add Event
                          </Button>
                        </div>
                      );
                    }

                    return daysEvents.map((event, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-all hover:shadow-md ${event.type === 'hearing' ? 'bg-red-50 border-red-100 group hover:border-red-200' :
                        event.type === 'booking' ? 'bg-blue-50 border-blue-100 group hover:border-blue-200' :
                          'bg-purple-50 border-purple-100 group hover:border-purple-200'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${event.type === 'hearing' ? 'bg-red-100 text-red-700' :
                            event.type === 'booking' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                            {event.type === 'hearing' ? 'Hearing' : event.type === 'booking' ? 'Consultation' : 'Personal Event'}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {event.time || 'All Day'}
                          </span>
                        </div>

                        <h4 className="font-bold text-[#0F2944] mb-1">
                          {event.type === 'hearing' ? event.case : event.type === 'booking' ? (event.description || 'Client Meeting') : event.title}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center mb-3">
                          {event.type === 'hearing'
                            ? <><MapPin className="w-3 h-3 mr-1" /> {event.court}</>
                            : <><Users className="w-3 h-3 mr-1" /> Client #{event.client_id?.substring(0, 4)}...</>
                          }
                        </p>
                        {
                          event.type === 'booking' && event.meet_link && (
                            <a
                              href={event.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full"
                            >
                              <Button size="sm" className="w-full bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 h-8 text-xs shadow-sm">
                                <Video className="w-3 h-3 mr-1" /> Join Google Meet
                              </Button>
                            </a>
                          )
                        }
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )
        }

        {/* Messages Tab */}
        {
          activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#0F2944]">Messages</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      End-to-End Encrypted
                    </span>
                  </div>
                  <p className="text-gray-500">Secure communication with your clients</p>
                </div>
                <Button className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6 shadow-lg shadow-blue-900/20">
                  + New Message
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input placeholder="Search conversations..." className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-[#0F2944] placeholder-gray-400 focus:ring-2 focus:ring-[#0F2944]/20" />
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
                              <h4 className="font-bold text-[#0F2944] truncate">{chat.name}</h4>
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
                            <p className="font-semibold text-[#0F2944]">{selectedChat.name}</p>
                            <p className="text-xs text-green-600">Online</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                            <MoreVertical className="w-5 h-5 text-gray-500" />
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
                                ? 'bg-[#0F2944] text-white rounded-tr-none'
                                : 'bg-white border border-gray-200 text-[#0F2944] rounded-tl-none'
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
                            className="flex-1 bg-white text-gray-900 border-gray-200 rounded-full px-5"
                          />
                          <Button type="submit" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center">
                            <span className="text-xl">➤</span>
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
            </motion.div>
          )
        }

        {/* Documents Tab */}
        {
          activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#0F2944]">Document Management</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      End-to-End Encrypted
                    </span>
                  </div>
                  <p className="text-green-600 flex items-center text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 "></span>
                    Secure encrypted vault
                  </p>
                </div>
                {!hasUploadPermission ?
                  <Button
                    onClick={() => {
                      setHasUploadPermission(true);
                      toast.success("Access granted! You can now upload documents.");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 shadow-lg shadow-amber-900/20 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Grant Upload Access</span>
                  </Button>
                  :
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={() => document.getElementById('doc-upload').click()}
                      className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6 shadow-lg shadow-blue-900/20"
                      disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Confirm & Upload'}
                    </Button>
                    <button
                      onClick={() => setHasUploadPermission(false)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Revoke Access
                    </button>
                  </div>
                }
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Documents</p>
                      <h3 className="text-3xl font-bold text-[#0F2944]">{documents.length || 0}</h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-50"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <span className="text-2xl">💾</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Storage Used</p>
                      <h3 className="text-3xl font-bold text-[#0F2944]">0.0 GB</h3>
                      <p className="text-xs text-gray-400">/ 50 GB</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Recent Uploads</p>
                      <h3 className="text-3xl font-bold text-[#0F2944]">0</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Name</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Associated Case</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length > 0 ? (
                      documents.map((doc, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                          <td className="px-6 py-4 flex items-center space-x-2">
                            <FileText className={`w-5 h-5 ${doc.file_type?.includes('pdf') ? 'text-red-500' : 'text-blue-500'}`} />
                            <a href={`${API.replace('/api', '')}${doc.file_url}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0F2944] hover:text-blue-600 transition-colors">
                              {doc.title}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{doc.case_id || 'Unassigned'}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase border border-gray-200">
                              {doc.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {doc.uploaded_at ? format(new Date(doc.uploaded_at), 'MMM d, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : '---'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedDocForShare(doc);
                                  setShowShareModal(true);
                                }}
                                className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                                title="Share Document"
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                                title="Delete Document"
                              >
                                <Archive className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No documents found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        }

        {/* Lawyer Network Tab */}
        {
          activeTab === 'network' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#0F2944]">Lawyer Network</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      State Bar Association: {user?.state || 'Verified'}
                    </span>
                  </div>
                  <p className="text-gray-500">Connect with fellow legal professionals in your jurisdiction</p>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-[600px]">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#0F2944] rounded-full flex items-center justify-center text-white">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F2944]">{user?.state || 'General'} State Network</h3>
                      <p className="text-xs text-gray-500">{loading ? 'Connecting...' : 'Online'}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {networkChat.length > 0 ? (
                    networkChat.map((msg, idx) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className="flex items-center space-x-2 mb-1">
                              {!isMe && <span className="text-xs font-bold text-gray-900">{msg.sender_name}</span>}
                              <span className="text-[10px] text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`p-3 rounded-2xl shadow-sm ${isMe
                              ? 'bg-[#0F2944] text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                              }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                      <p>No messages yet. Start the discussion!</p>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={handleSendNetworkMessage} className="flex space-x-4">
                    <Input
                      value={newNetworkMessage}
                      onChange={(e) => setNewNetworkMessage(e.target.value)}
                      placeholder={`Message ${user?.state || ''} Network...`}
                      className="flex-1 bg-white text-gray-900 border-gray-200"
                    />
                    <Button type="submit" className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white">
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          )
        }


        {/* Earnings Tab */}
        {
          activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#0F2944] mb-2">Earnings & Billing</h1>
                  <p className="text-gray-500">Track your income and manage your finances</p>
                </div>
                <Button className="bg-[#0F2944] hover:bg-[#0F2944]/90 text-white rounded-xl px-6 shadow-lg shadow-blue-900/20">
                  Generate Report
                </Button>
              </div>

              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                  <p className="text-sm text-gray-500 mb-2 relative z-10 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-4xl font-bold text-[#0F2944] relative z-10">₹{dashboardData.stats.revenue?.toLocaleString() || '0'}</h3>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50"></div>
                  <p className="text-sm text-gray-500 mb-2 relative z-10 uppercase tracking-wider">This Month</p>
                  <h3 className="text-4xl font-bold text-[#0F2944] relative z-10">₹0.00</h3>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 relative overflow-hidden group shadow-lg">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
                  <p className="text-sm text-gray-500 mb-2 relative z-10 uppercase tracking-wider">Pending Payments</p>
                  <h3 className="text-4xl font-bold text-[#0F2944] relative z-10">₹0.00</h3>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-[#0F2944]">Billing History</h2>
                </div>

                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.length > 0 ? (
                      billingHistory.map((bill, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                          <td className="px-6 py-4 font-medium text-[#0F2944]">{bill.invoice}</td>
                          <td className="px-6 py-4 text-[#0F2944]">{bill.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{bill.case}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{bill.date}</td>
                          <td className="px-6 py-4 font-semibold text-[#0F2944]">{bill.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bill.status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                              bill.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                'bg-red-100 text-red-700 border border-red-200'
                              }`}>
                              {bill.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No billing history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        }


        {/* New Case Modal */}
        {
          showCaseModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-[#0F2944]">Create New Case</h3>
                  <button onClick={() => setShowCaseModal(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateCase} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case Title</label>
                    <Input
                      value={newCaseData.title}
                      onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                      placeholder="e.g. Smith vs Jones"
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <Input
                        required
                        value={newCaseData.client_name}
                        onChange={(e) => setNewCaseData({ ...newCaseData, client_name: e.target.value })}
                        placeholder="Client Name"
                        className="text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 p-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newCaseData.case_type}
                        onChange={(e) => setNewCaseData({ ...newCaseData, case_type: e.target.value })}
                      >
                        <option value="">Select Type</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Civil">Civil</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Family">Family</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Court / Stage</label>
                    <Input
                      value={newCaseData.court}
                      onChange={(e) => setNewCaseData({ ...newCaseData, court: e.target.value })}
                      placeholder="e.g. High Court / Filing"
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setShowCaseModal(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                    <Button type="submit" className="bg-[#0F2944] text-white hover:bg-[#0F2944]/90">Create Case</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )
        }

        {/* Delete Confirmation Modal */}
        {docToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Document?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-700">"{docToDelete.title}"</span>? This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setDocToDelete(null)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDeleteDocument}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 shadow-lg shadow-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Event Modal */}
        {
          showEventModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-[#0F2944]">Add to Calendar</h3>
                  <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <Input
                      required
                      value={newEventData.title}
                      onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                      placeholder="e.g. Meeting with Associate"
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 p-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newEventData.type}
                        onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value })}
                      >
                        <option value="meeting">Meeting</option>
                        <option value="personal">Personal</option>
                        <option value="hearing">Hearing</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <Input
                        type="datetime-local"
                        required
                        value={newEventData.start_time}
                        onChange={(e) => setNewEventData({ ...newEventData, start_time: e.target.value })}
                        className="text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <Input
                        type="datetime-local"
                        required
                        value={newEventData.end_time}
                        onChange={(e) => setNewEventData({ ...newEventData, end_time: e.target.value })}
                        className="text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full rounded-xl border border-gray-200 p-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      value={newEventData.description}
                      onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setShowEventModal(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                    <Button type="submit" className="bg-[#0F2944] text-white hover:bg-[#0F2944]/90">Add Event</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )
        }

        {/* Reschedule Booking Modal */}
        {
          showRescheduleModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-[#0F2944]">Reschedule Consultation</h3>
                  <button onClick={() => setShowRescheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-600">Propose a new date and time for this consultation.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                    <Input
                      type="date"
                      required
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                    <Input
                      type="time"
                      required
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowRescheduleModal(false)} className="border-gray-300 text-gray-700">Cancel</Button>
                    <Button onClick={handleRescheduleBooking} className="bg-amber-500 text-white hover:bg-amber-600">Confirm Reschedule</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }

        {/* Share Document Modal */}
        {
          showShareModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2944]">Share Document</h3>
                    <p className="text-xs text-gray-500 mt-1">Sharing: {selectedDocForShare?.title}</p>
                  </div>
                  <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search client name..."
                      value={shareSearchQuery}
                      onChange={(e) => setShareSearchQuery(e.target.value)}
                      className="pl-10 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 py-2">
                    {cases
                      .filter(c => c.client_name.toLowerCase().includes(shareSearchQuery.toLowerCase()))
                      .map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group"
                          onClick={() => handleShareDocument(c.user_id)} // Sharing with client user ID
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                              {c.client_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0F2944] group-hover:text-blue-700">{c.client_name}</p>
                              <p className="text-xs text-gray-500">{c.title}</p>
                            </div>
                          </div>
                          <Button size="sm" className="bg-[#0F2944] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Share
                          </Button>
                        </div>
                      ))}
                    {cases.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No active cases or clients found.
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" onClick={() => setShowShareModal(false)} className="border-gray-300 text-gray-700">
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }
      </div >
    </div >
  );
}
