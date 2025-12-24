'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Message {
  id: string;
  event_id: string;
  sender_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
  profiles: { name: string } | null;
}

interface Participant {
  id: string;
  name: string;
  role: string;
}

export default function ChatPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchMessages(selectedEvent);
      fetchParticipants(selectedEvent);

      // Set up real-time subscription
      const supabase = createClient();
      const channel = supabase
        .channel(`messages:${selectedEvent}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `event_id=eq.${selectedEvent}`,
          },
          (payload) => {
            fetchMessages(selectedEvent);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedEvent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchEvents() {
    const supabase = createClient();
    const { data } = await supabase
      .from('events')
      .select('id, title, date, status')
      .in('status', ['open', 'live'])
      .order('date', { ascending: true });

    if (data) {
      setEvents(data);
      if (data.length > 0) {
        setSelectedEvent(data[0].id);
      }
    }
    setLoading(false);
  }

  async function fetchMessages(eventId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('messages')
      .select(`
        id, event_id, sender_id, content, is_private, created_at,
        profiles:sender_id (name)
      `)
      .eq('event_id', eventId)
      .eq('is_private', false)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as unknown as Message[]);
    }
  }

  async function fetchParticipants(eventId: string) {
    const supabase = createClient();

    // Get event creator and assigned staff
    const { data: event } = await supabase
      .from('events')
      .select('created_by, client_id, vendor_id')
      .eq('id', eventId)
      .single();

    const { data: dispatches } = await supabase
      .from('dispatch_requests')
      .select('staff_id, profiles:staff_id (name)')
      .eq('event_id', eventId)
      .eq('status', 'accepted');

    const participantList: Participant[] = [];

    // Add admin
    participantList.push({ id: 'admin', name: 'Admin', role: 'admin' });

    // Add assigned staff
    if (dispatches) {
      dispatches.forEach((d) => {
        const profile = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles;
        if (profile) {
          participantList.push({
            id: d.staff_id,
            name: profile.name,
            role: 'staff',
          });
        }
      });
    }

    setParticipants(participantList);
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedEvent) return;

    setSending(true);
    const supabase = createClient();

    // Get current user - in real app this comes from auth
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('messages').insert({
      event_id: selectedEvent,
      sender_id: user?.id || 'admin',
      content: newMessage.trim(),
      is_private: false,
    });

    if (!error) {
      setNewMessage('');
      fetchMessages(selectedEvent);
    }
    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">Event-based communication</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Event List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h2 className="font-semibold text-slate-900">Event Chats</h2>
            </CardHeader>
            <CardContent className="p-0">
              {events.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {events.map((event) => {
                    const isSelected = selectedEvent === event.id;
                    return (
                      <li
                        key={event.id}
                        onClick={() => setSelectedEvent(event.id)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <p className="font-medium text-slate-900 text-sm">{event.title}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-slate-600 text-sm">
                  No active events with chat.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedEvent ? (
              <>
                <CardHeader className="border-b">
                  <h2 className="font-semibold text-slate-900">
                    {events.find(e => e.id === selectedEvent)?.title}
                  </h2>
                  <p className="text-sm text-slate-600">Group Chat</p>
                </CardHeader>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isCurrentUser = message.sender_id === 'admin'; // Replace with actual user check
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isCurrentUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            {!isCurrentUser && (
                              <p className="text-xs font-medium mb-1 opacity-75">
                                {message.profiles?.name || 'Unknown'}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-slate-500'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-600">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
                      {sending ? '...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-slate-600">Select an event to view chat</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Participants */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h2 className="font-semibold text-slate-900">Participants</h2>
            </CardHeader>
            <CardContent className="p-0">
              {selectedEvent && participants.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {participants.map((participant) => (
                    <li key={participant.id} className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        participant.role === 'admin' ? 'bg-blue-600' : 'bg-slate-200'
                      }`}>
                        <span className={`text-sm font-medium ${
                          participant.role === 'admin' ? 'text-white' : 'text-slate-700'
                        }`}>
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{participant.name}</p>
                        <p className="text-xs text-slate-600 capitalize">{participant.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-slate-600 text-sm">
                  Select an event to see participants.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
