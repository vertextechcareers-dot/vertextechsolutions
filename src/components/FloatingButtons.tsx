import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mail, Phone, Send, X, Minus, User, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsultation } from './ConsultationProvider';

const WHATSAPP_NUMBER = '254751936947';
const EMAIL_ADDRESS = 'oscarodero@tech-center.com';

interface ChatMessage {
  id?: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at?: string;
}

const FloatingButtons = () => {
  const { openConsultation } = useConsultation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [chatStep, setChatStep] = useState<'info' | 'chat'>('info');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to realtime for admin replies
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (newMsg.sender_type === 'admin') {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleStartChat = async () => {
    if (!userName.trim() || !userEmail.trim()) return;
    setIsSending(true);

    // Create conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_name: userName.trim(),
        user_email: userEmail.trim(),
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      setIsSending(false);
      return;
    }

    setConversationId(conversation.id);
    setChatStep('chat');
    setIsSending(false);

    // Send initial message if any
    if (messageText.trim()) {
      await sendMessage(conversation.id, messageText.trim());
      setMessageText('');
    }
  };

  const sendMessage = async (convId: string, text: string) => {
    const visitorMsg: ChatMessage = {
      message: text,
      sender_type: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, visitorMsg]);

    const { error } = await supabase.from('messages').insert({
      conversation_id: convId,
      message: text,
      name: userName,
      email: userEmail,
      sender_type: 'user',
    });

    if (error) {
      console.error('Error sending message:', error);
    }

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', convId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    await sendMessage(conversationId, messageText.trim());
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatStep === 'chat') {
        handleSendMessage();
      } else {
        handleStartChat();
      }
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            {showTooltip}
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}

        {/* Free Consultation Button */}
        <button
          onClick={() => openConsultation()}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-green text-white flex items-center justify-center shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setShowTooltip('Free Consultation')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-20" />
          <Sparkles size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setShowTooltip('Chat on WhatsApp')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          <Phone size={24} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        </a>

        {/* Email Button */}
        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setShowTooltip('Send an Email')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-20" />
          <Mail size={22} className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </a>

        {/* Chat Button */}
        <button
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setIsMinimized(false);
          }}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-purple to-purple-700 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setShowTooltip('Live Chat')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="absolute inset-0 rounded-full bg-brand-purple animate-ping opacity-20" />
          <MessageCircle size={24} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      {/* Chat Window */}
      {isChatOpen && !isMinimized && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-2rem)] z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/20 bg-white/80 backdrop-blur-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-purple p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Live Chat</h3>
                    <p className="text-xs text-white/70">We typically reply in minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="h-[380px] flex flex-col">
              {chatStep === 'info' ? (
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 flex items-center justify-center mx-auto mb-3">
                      <User size={28} className="text-brand-purple" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg">Start a Conversation</h4>
                    <p className="text-slate-500 text-sm mt-1">Tell us who you are so we can assist you better</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
                    />
                    <textarea
                      placeholder="How can we help? (optional)"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all resize-none"
                    />
                    <button
                      onClick={handleStartChat}
                      disabled={!userName.trim() || !userEmail.trim() || isSending}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          Start Chat
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        Conversation started
                      </span>
                    </div>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.sender_type === 'user'
                              ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-slate-100 bg-white/50 backdrop-blur">
                    <div className="flex items-end gap-2">
                      <textarea
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all resize-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minimized Chat Indicator */}
      {isChatOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-all duration-300 animate-in zoom-in-50 fade-in duration-200"
        >
          <MessageCircle size={24} />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </button>
      )}
    </>
  );
};

export default FloatingButtons;