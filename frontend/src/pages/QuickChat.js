import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageSquare, Send, ArrowLeft, Scale, Bot, Sparkles, Shield, MapPin, Bell, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

export default function QuickChat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: {
        cards: [
          { type: 'greeting', title: 'Welcome to Lxwyer Up', content: "Hello! I'm your AI legal assistant. I can help you understand legal concepts, procedures, and your rights." },
          { type: 'info', title: 'How I Can Help', content: "Ask me about legal procedures, documents needed, your rights, or any general legal query." },
          { type: 'action', title: 'Get Started', content: "Type your legal question below. For example: 'What is bail?' or 'How to file FIR?'" }
        ]
      }
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Guest session ID
  const [guestSessionId] = useState('guest_' + Math.random().toString(36).substring(7));

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);
    
    try {
      const systemPrompt = `You are Lxwyer Up's AI Legal Assistant for Indian users. Help users understand legal concepts, procedures, and their rights.

RESPONSE FORMAT - Always respond with structured JSON cards:
{
  "cards": [
    {"type": "greeting", "title": "Title", "content": "Your message"},
    {"type": "info", "title": "Key Information", "content": "Main info"},
    {"type": "advice", "title": "Legal Insight", "content": "Advice"},
    {"type": "action", "title": "Next Steps", "content": "What to do"}
  ]
}

RULES:
- Be helpful and informative
- Use simple language, mix Hindi-English if user writes in Hindi
- Break complex info into multiple cards
- Keep each card brief (2-3 lines)
- Use 2-4 cards per response
- For serious matters, suggest consulting a lawyer

CARD TYPES:
- greeting: Welcome/acknowledgment
- question: Asking for clarification
- info: Key information/facts
- advice: Legal guidance
- action: Steps to take
- warning: Important cautions
- definition: Legal term explanation`;

      const response = await axios.post(`${API}/chat/guest`, { 
        message: chatInput,
        session_id: guestSessionId,
        system_prompt: systemPrompt
      });

      let aiResponse = response.data.response;
      
      // Parse response into cards
      const cards = parseResponseToCards(aiResponse);
      setChatMessages(prev => [...prev, { role: 'assistant', content: { cards } }]);
      
    } catch (error) {
      toast.error('Chat unavailable. Please try again.');
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: { cards: [{ type: 'warning', title: 'Connection Error', content: 'Unable to connect. Please try again or sign up for full access.' }] }
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse AI response into cards
  const parseResponseToCards = (response) => {
    // Try JSON parsing first
    try {
      const jsonMatch = response.match(/```json?\s*([\s\S]*?)```/) || response.match(/\{[\s\S]*"cards"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          return parsed.cards;
        }
      }
    } catch (e) {
      // JSON parsing failed, continue to text parsing
    }

    // Parse markdown/text response into cards
    const cards = [];
    const sections = response.split(/(?=##\s|###\s|\*\*[^*]+\*\*:)/);
    
    sections.forEach((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed) return;

      // Detect section type and title
      let type = 'info';
      let title = 'Information';
      let content = trimmed;

      // Extract title from ## or ###
      const titleMatch = trimmed.match(/^#{1,3}\s*(.+?)[\n\r]/);
      if (titleMatch) {
        title = titleMatch[1].replace(/[#*]/g, '').trim();
        content = trimmed.replace(/^#{1,3}\s*.+?[\n\r]/, '').trim();
      }

      // Extract title from **bold**:
      const boldMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*/);
      if (boldMatch) {
        title = boldMatch[1].trim();
        content = trimmed.replace(/^\*\*(.+?)\*\*:?\s*/, '').trim();
      }

      // Determine card type based on keywords
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('welcome') || lowerTitle.includes('hello') || idx === 0) {
        type = 'greeting';
      } else if (lowerTitle.includes('step') || lowerTitle.includes('action') || lowerTitle.includes('next') || lowerTitle.includes('do')) {
        type = 'action';
      } else if (lowerTitle.includes('advice') || lowerTitle.includes('suggest') || lowerTitle.includes('recommend')) {
        type = 'advice';
      } else if (lowerTitle.includes('warning') || lowerTitle.includes('caution') || lowerTitle.includes('important')) {
        type = 'warning';
      } else if (lowerTitle.includes('question') || lowerTitle.includes('clarif')) {
        type = 'question';
      }

      // Clean up content - remove markdown symbols
      content = content
        .replace(/^[-*•]\s*/gm, '• ')  // Convert list items to bullet
        .replace(/^\d+\.\s*/gm, '• ')   // Convert numbered lists to bullets
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.+?)\*/g, '$1')     // Remove italic markdown
        .replace(/`(.+?)`/g, '$1')       // Remove code markdown
        .trim();

      if (content && content.length > 5) {
        cards.push({ type, title, content: content.substring(0, 300) }); // Limit content length
      }
    });

    // If no cards were parsed, create a single info card
    if (cards.length === 0) {
      const cleanContent = response
        .replace(/#{1,3}\s*/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/^[-*•]\s*/gm, '• ')
        .trim();
      cards.push({ type: 'info', title: 'Response', content: cleanContent.substring(0, 500) });
    }

    return cards.slice(0, 6); // Max 6 cards
  };

  // Render card component
  const renderCard = (card, cardIdx) => (
    <motion.div
      key={cardIdx}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: cardIdx * 0.1 }}
      className={`rounded-xl p-4 border backdrop-blur-sm ${
        card.type === 'greeting' ? 'bg-gradient-to-br from-purple-900/60 to-purple-800/40 border-purple-500/40' :
        card.type === 'question' ? 'bg-gradient-to-br from-blue-900/60 to-blue-800/40 border-blue-500/40' :
        card.type === 'info' ? 'bg-gradient-to-br from-slate-800/60 to-slate-700/40 border-slate-600/40' :
        card.type === 'advice' ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border-emerald-500/40' :
        card.type === 'action' ? 'bg-gradient-to-br from-amber-900/60 to-amber-800/40 border-amber-500/40' :
        card.type === 'warning' ? 'bg-gradient-to-br from-red-900/60 to-red-800/40 border-red-500/40' :
        card.type === 'definition' ? 'bg-gradient-to-br from-cyan-900/60 to-cyan-800/40 border-cyan-500/40' :
        'bg-slate-800/60 border-slate-700/40'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {card.type === 'greeting' && <Sparkles className="w-4 h-4 text-purple-400" />}
        {card.type === 'question' && <MessageSquare className="w-4 h-4 text-blue-400" />}
        {card.type === 'info' && <Scale className="w-4 h-4 text-slate-400" />}
        {card.type === 'advice' && <Shield className="w-4 h-4 text-emerald-400" />}
        {card.type === 'action' && <ArrowRight className="w-4 h-4 text-amber-400" />}
        {card.type === 'warning' && <Bell className="w-4 h-4 text-red-400" />}
        {card.type === 'definition' && <Scale className="w-4 h-4 text-cyan-400" />}
        <span className={`text-sm font-semibold ${
          card.type === 'greeting' ? 'text-purple-300' :
          card.type === 'question' ? 'text-blue-300' :
          card.type === 'info' ? 'text-slate-300' :
          card.type === 'advice' ? 'text-emerald-300' :
          card.type === 'action' ? 'text-amber-300' :
          card.type === 'warning' ? 'text-red-300' :
          card.type === 'definition' ? 'text-cyan-300' :
          'text-slate-300'
        }`}>{card.title}</span>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed">{card.content}</p>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              data-testid="back-to-home"
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <Bot className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Lxwyer Up AI Chat</h1>
              <p className="text-sm text-slate-400">Ask any legal question</p>
            </div>
          </div>
          
          <Button
            data-testid="signup-cta"
            onClick={() => navigate('/role-selection')}
            className="bg-blue-700 hover:bg-blue-600 rounded-full px-6 py-2"
          >
            Sign Up for Full Access
          </Button>
        </div>
      </div>
      
      {/* Chat Container - Full Height */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-4">
        <div className="flex-1 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Legal Assistant</h2>
                <p className="text-blue-100 text-sm">Get instant answers to your legal questions</p>
              </div>
            </div>
          </div>
          
          {/* Chat Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3">
                    <p>{msg.content}</p>
                  </div>
                ) : (
                  <div className="w-full max-w-[95%]">
                    {msg.content?.cards ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {msg.content.cards.map((card, cardIdx) => renderCard(card, cardIdx))}
                      </div>
                    ) : (
                      <div className="bg-slate-800 text-slate-200 rounded-2xl px-4 py-3">
                        <p className="whitespace-pre-wrap">{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-slate-400 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-slate-700 p-4 flex-shrink-0">
            <form onSubmit={handleChat} className="flex gap-3">
              <Input
                data-testid="quick-chat-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a legal question... (e.g., What is bail?)"
                className="flex-1 bg-slate-800 border-slate-700 focus:border-blue-500 rounded-full px-6"
                disabled={loading}
              />
              <Button 
                data-testid="quick-chat-send"
                type="submit" 
                disabled={loading || !chatInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full px-8"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            
            <div className="mt-3 text-center text-xs text-slate-500">
              💡 Sign up for unlimited chats, case tracking, and lawyer consultations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
