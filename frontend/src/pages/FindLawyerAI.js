import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Send, Bot, Briefcase, MapPin, ArrowRight, X, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { CorporateButton, CorporateBadge } from '../components/CorporateComponents';
import { dummyLawyers, specializations } from '../data/lawyersData';

export default function FindLawyerAI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      cards: [
        {
          type: 'greeting',
          icon: 'bot',
          title: 'Welcome to Lxwyer Up AI',
          content: "Hello! I'm your AI legal assistant. I'll help you find the perfect lawyer for your case."
        },
        {
          type: 'question',
          icon: 'message',
          title: 'Tell Me About Your Case',
          content: 'Please describe your legal issue. For example: "I have a property dispute" or "Need help with divorce case"'
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedLawyers, setRecommendedLawyers] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [conversationState, setConversationState] = useState({
    caseType: null,
    state: null,
    hasRecommended: false
  });

  const detectCaseType = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('property') || msg.includes('land') || msg.includes('real estate')) return 'Property Law';
    if (msg.includes('divorce') || msg.includes('custody') || msg.includes('family') || msg.includes('marriage')) return 'Family Law';
    if (msg.includes('criminal') || msg.includes('fir') || msg.includes('police') || msg.includes('arrest')) return 'Criminal Law';
    if (msg.includes('business') || msg.includes('company') || msg.includes('corporate')) return 'Corporate Law';
    if (msg.includes('civil') || msg.includes('dispute') || msg.includes('compensation')) return 'Civil Law';
    if (msg.includes('tax') || msg.includes('gst') || msg.includes('income')) return 'Tax Law';
    if (msg.includes('labour') || msg.includes('employee') || msg.includes('worker')) return 'Labour Law';
    if (msg.includes('consumer') || msg.includes('product') || msg.includes('service')) return 'Consumer Law';
    return null;
  };

  const detectState = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('delhi')) return 'Delhi';
    if (msg.includes('uttar pradesh') || msg.includes('up') || msg.includes('lucknow') || msg.includes('noida') || msg.includes('ghaziabad')) return 'Uttar Pradesh';
    if (msg.includes('haryana') || msg.includes('gurgaon') || msg.includes('faridabad')) return 'Haryana';
    if (msg.includes('maharashtra') || msg.includes('mumbai') || msg.includes('pune')) return 'Maharashtra';
    return null;
  };

  const recommendLawyers = (caseType, state) => {
    let filtered = [...dummyLawyers];

    if (caseType) {
      filtered = filtered.filter(l => l.specialization === caseType);
    }

    if (state) {
      filtered = filtered.filter(l => l.state === state);
    }

    filtered.sort((a, b) => b.experience - a.experience);
    return filtered.slice(0, 3);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const detectedCase = detectCaseType(userMessage);
      const detectedState = detectState(userMessage);

      const newState = {
        caseType: detectedCase || conversationState.caseType,
        state: detectedState || conversationState.state,
        hasRecommended: false
      };
      setConversationState(newState);

      let responseCards = [];

      if (newState.caseType && newState.state && !conversationState.hasRecommended) {
        // Both case type and state detected - recommend lawyers
        const lawyers = recommendLawyers(newState.caseType, newState.state);

        if (lawyers.length > 0) {
          responseCards = [
            {
              type: 'success',
              icon: 'check',
              title: 'Perfect! I Found Lawyers For You',
              content: `Based on your ${newState.caseType} case in ${newState.state}, I've found ${lawyers.length} top-rated lawyers.`
            },
            {
              type: 'info',
              icon: 'alert',
              title: 'Recommended Lawyers',
              content: `✓ ${lawyers.map(l => l.name).join('\n✓ ')}\n\nView their profiles below and book a consultation!`
            }
          ];

          setRecommendedLawyers(lawyers);
          setShowRecommendations(true);
          setConversationState(prev => ({ ...prev, hasRecommended: true }));
        }
      } else if (newState.caseType && !newState.state) {
        // Case type detected but no state
        responseCards = [
          {
            type: 'info',
            icon: 'message',
            title: 'Great! I Understand Your Case',
            content: `I can help you with your ${newState.caseType} matter.`
          },
          {
            type: 'question',
            icon: 'alert',
            title: 'Which State Are You In?',
            content: 'To find the best lawyers near you, please tell me your state:\n• Delhi\n• Uttar Pradesh\n• Haryana\n• Maharashtra'
          }
        ];
      } else if (!newState.caseType && newState.state) {
        // State detected but no case type
        responseCards = [
          {
            type: 'info',
            icon: 'check',
            title: 'Location Noted',
            content: `I see you're in ${newState.state}.`
          },
          {
            type: 'question',
            icon: 'message',
            title: 'What Type of Legal Help Do You Need?',
            content: 'Please describe your case type:\n• Civil matters\n• Criminal cases\n• Family law (divorce, custody)\n• Property disputes\n• Corporate/Business law\n• Tax issues\n• Labour/Employment\n• Other'
          }
        ];
      } else {
        // Neither detected - ask for more details
        responseCards = [
          {
            type: 'question',
            icon: 'message',
            title: 'I Need More Details',
            content: "Could you please tell me:\n1. What type of legal issue? (property, divorce, criminal, etc.)\n2. Which state are you in? (Delhi, UP, Haryana, Maharashtra)"
          },
          {
            type: 'info',
            icon: 'alert',
            title: 'Example',
            content: 'For example: "I have a property dispute in Delhi" or "Need divorce lawyer in Mumbai"'
          }
        ];
      }

      setMessages(prev => [...prev, { role: 'assistant', cards: responseCards }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleBookConsultation = (lawyer) => {
    navigate('/book-consultation-signup', { state: { lawyer } });
  };

  const getCardIcon = (iconType) => {
    switch (iconType) {
      case 'bot': return Bot;
      case 'check': return CheckCircle;
      case 'alert': return AlertCircle;
      case 'message': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'greeting':
        return 'bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30';
      case 'success':
        return 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30';
      case 'question':
        return 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700';
      case 'info':
        return 'bg-gradient-to-br from-blue-900/10 to-slate-900 border-slate-700';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/find-lawyer')}
              className="flex items-center space-x-3 text-white hover:text-blue-500 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">Lxwyer Up</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/find-lawyer/manual')}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Try Manual Search
              </button>
              <button
                onClick={() => navigate('/role-selection?mode=login')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Login
              </button>
              <CorporateButton
                variant="primary"
                onClick={() => navigate('/user-signup')}
              >
                Sign Up
              </CorporateButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg mb-4">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500 text-sm font-medium">AI Legal Assistant</span>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Chat with AI to Find Lawyers
          </h1>
          <p className="text-slate-400">
            Describe your case and get personalized recommendations
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden mb-8">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-lg p-4">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {msg.cards?.map((card, cardIdx) => {
                      const IconComponent = getCardIcon(card.icon);
                      return (
                        <div
                          key={cardIdx}
                          className={`border rounded-lg p-4 ${getCardStyle(card.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-2">{card.title}</h4>
                              <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                                {card.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your legal issue..."
                className="flex-1 px-4 py-3 bg-black border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Lawyers */}
        {showRecommendations && recommendedLawyers.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Recommended Lawyers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedLawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={lawyer.photo}
                      alt={lawyer.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{lawyer.name}</h3>
                      <p className="text-sm text-slate-400">{lawyer.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Briefcase className="w-4 h-4" />
                      {lawyer.experience} years
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {lawyer.city}, {lawyer.state}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-slate-400 line-clamp-2">{lawyer.bio}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedLawyer(lawyer)}
                      className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleBookConsultation(lawyer)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      Book Consultation
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lawyer Profile Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-white">Lawyer Profile</h2>
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedLawyer.photo}
                  alt={selectedLawyer.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedLawyer.name}</h3>
                  <p className="text-slate-400 mb-2">{selectedLawyer.specialization}</p>
                  <div className="flex items-center gap-4">
                    <CorporateBadge variant="info">{selectedLawyer.experience} Years</CorporateBadge>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">About</h4>
                  <p className="text-white">{selectedLawyer.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Location</h4>
                    <p className="text-white">{selectedLawyer.city}, {selectedLawyer.state}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Court</h4>
                    <p className="text-white text-sm">{selectedLawyer.court}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Languages</h4>
                  <p className="text-white">{selectedLawyer.languages.join(', ')}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Consultation Fee</h4>
                  <p className="text-white">{selectedLawyer.fee}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Experience</h4>
                  <p className="text-white">{selectedLawyer.experience}+ years of practice</p>
                </div>
              </div>

              <CorporateButton
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleBookConsultation(selectedLawyer)}
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </CorporateButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
