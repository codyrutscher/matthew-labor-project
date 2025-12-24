'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockEvents, mockMessages, mockStaff, mockDispatchRequests } from '@/lib/mockData';

export default function ChatPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');

  const getEventMessages = (eventId: string) => {
    return mockMessages.filter(m => m.eventId === eventId);
  };

  const getEventParticipants = (eventId: string) => {
    const dispatches = mockDispatchRequests.filter(d => d.eventId === eventId && d.status === 'accepted');
    return dispatches.map(d => mockStaff.find(s => s.id === d.staffId)).filter(Boolean);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In real app, this would send to Supabase
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Event-based communication</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Event List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h2 className="font-semibold">Event Chats</h2>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-200">
                {mockEvents.map((event) => {
                  const messages = getEventMessages(event.id);
                  const lastMessage = messages[messages.length - 1];
                  const isSelected = selectedEvent === event.id;

                  return (
                    <li
                      key={event.id}
                      onClick={() => setSelectedEvent(event.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      {lastMessage && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {lastMessage.senderName}: {lastMessage.content}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedEvent ? (
              <>
                <CardHeader className="border-b">
                  <h2 className="font-semibold">
                    {mockEvents.find(e => e.id === selectedEvent)?.title}
                  </h2>
                </CardHeader>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getEventMessages(selectedEvent).map((message) => {
                    const isAdmin = message.senderId.startsWith('admin');
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isAdmin
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {!isAdmin && (
                            <p className="text-xs font-medium mb-1">{message.senderName}</p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isAdmin ? 'text-blue-200' : 'text-gray-500'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button onClick={handleSend}>Send</Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select an event to view chat</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Participants */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h2 className="font-semibold">Participants</h2>
            </CardHeader>
            <CardContent className="p-0">
              {selectedEvent && (
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">M</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Matthew</p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                  </li>
                  {getEventParticipants(selectedEvent).map((staff) => (
                    <li key={staff?.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {staff?.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{staff?.name}</p>
                        <p className="text-xs text-gray-500">Staff</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
