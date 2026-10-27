import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  Trash2,
  CheckCircle,
  Circle,
  Users,
  ArrowLeft,
  Mail,
  Reply,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

interface Conversation {
  id: string;
  user_name: string;
  user_email: string;
  status: string;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Message {
  id: string;
  conversation_id: string | null;
  name: string;
  email: string;
  message: string;
  sender_type: string;
  is_read: boolean | null;
  created_at: string | null;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Subscribe to realtime for new messages in selected conversation
  useEffect(() => {
    if (!selectedConv) return;

    const channel = supabase
      .channel(`admin-chat-${selectedConv.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add if it's from the user (admin's own replies are added optimistically)
          if (newMsg.sender_type === 'user') {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          // Refresh conversations list when a new conversation is created
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConv]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Sonner.toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark all user messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'user')
        .eq('is_read', false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Sonner.toast.error('Failed to load messages');
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    fetchMessages(conv.id);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConv) return;
    setSendingReply(true);

    const adminMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConv.id,
      name: 'Admin',
      email: 'admin@vertex.com',
      message: replyText.trim(),
      sender_type: 'admin',
      is_read: true,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, adminMsg]);
    setReplyText('');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConv.id,
        message: replyText.trim(),
        name: 'Admin',
        email: 'admin@vertex.com',
        sender_type: 'admin',
        is_read: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending reply:', error);
      Sonner.toast.error('Failed to send reply');
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== adminMsg.id));
    } else if (data) {
      // Replace temp message with real one
      setMessages((prev) => prev.map(m => m.id === adminMsg.id ? data : m));
    }

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', selectedConv.id);

    setSendingReply(false);
  };

  const closeConversation = async (convId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status: 'closed' })
        .eq('id', convId);

      if (error) throw error;
      Sonner.toast.success('Conversation closed');
      fetchConversations();
      if (selectedConv?.id === convId) {
        setSelectedConv(null);
        setMessages([]);
      }
    } catch (error) {
      Sonner.toast.error('Failed to close conversation');
    }
  };

  const deleteConversation = async (convId: string) => {
    if (!confirm('Delete this conversation and all its messages?')) return;
    try {
      // Delete messages first
      await supabase.from('messages').delete().eq('conversation_id', convId);
      // Then delete conversation
      const { error } = await supabase.from('conversations').delete().eq('id', convId);
      if (error) throw error;
      Sonner.toast.success('Conversation deleted');
      fetchConversations();
      if (selectedConv?.id === convId) {
        setSelectedConv(null);
        setMessages([]);
      }
    } catch (error) {
      Sonner.toast.error('Failed to delete conversation');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const getUnreadCount = (convId: string) => {
    return messages.filter(m => m.conversation_id === convId && !m.is_read && m.sender_type === 'user').length;
  };

  const getLastMessage = (convId: string) => {
    const convMessages = messages.filter(m => m.conversation_id === convId);
    return convMessages.length > 0 ? convMessages[convMessages.length - 1] : null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Chat Conversations</h2>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {conversations.filter(c => c.status === 'active').length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Conversations List */}
        <Card className={cn(
          "border-none shadow-sm overflow-hidden flex flex-col",
          selectedConv && "lg:col-span-1"
        )}>
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Users size={18} />
              Conversations
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors",
                    selectedConv?.id === conv.id && "bg-brand-blue/5 border-l-4 border-l-brand-blue"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {conv.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{conv.user_name}</p>
                          <p className="text-xs text-slate-400 truncate">{conv.user_email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-slate-400">
                        {conv.last_message_at && format(new Date(conv.last_message_at), 'MMM dd')}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          conv.status === 'active' ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {conv.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className={cn(
          "border-none shadow-sm overflow-hidden flex flex-col",
          !selectedConv && "hidden lg:flex lg:col-span-2"
        )}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedConv(null)}
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold">
                    {selectedConv.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedConv.user_name}</h3>
                    <p className="text-xs text-slate-500">{selectedConv.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEmailOpen(true)}
                    title="Reply via Email"
                  >
                    <Mail size={16} className="text-slate-500" />
                  </Button>
                  {selectedConv.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => closeConversation(selectedConv.id)}
                      className="text-xs text-slate-500"
                    >
                      Close
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteConversation(selectedConv.id)}
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                <div className="text-center">
                  <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
                    Conversation started {selectedConv.created_at && format(new Date(selectedConv.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender_type === 'admin' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                        msg.sender_type === 'admin'
                          ? "bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.sender_type === 'admin' ? "text-white/60" : "text-slate-400"
                      )}>
                        {msg.created_at && format(new Date(msg.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <div className="p-3 border-t bg-white">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    className="resize-none"
                  />
                  <Button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="gap-2 bg-brand-blue hover:bg-brand-blue/90 h-10"
                  >
                    {sendingReply ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Email Reply Dialog */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply via Email</DialogTitle>
            <DialogDescription>Send an email reply to {selectedConv?.user_name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-4">
              This will open your email client to send a reply to <strong>{selectedConv?.user_email}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>Cancel</Button>
            <Button
              className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => {
                window.location.href = `mailto:${selectedConv?.user_email}?subject=Re: Your chat with Vertex Tech Solutions`;
                setIsEmailOpen(false);
              }}
            >
              <Reply size={16} /> Open Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
