'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockEvents } from '@/lib/mockData';

export default function EventsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      case 'open':
        return <Badge variant="success">Open</Badge>;
      case 'live':
        return <Badge variant="info">Live</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Manage upcoming events and staffing</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ Create Event</Button>
      </div>

      <div className="grid gap-6">
        {mockEvents.map((event) => {
          const eventDate = new Date(event.date);
          const totalRequired = event.roleRequirements.reduce((sum, r) => sum + r.quantity, 0);
          const totalFilled = event.roleRequirements.reduce((sum, r) => sum + r.filled, 0);
          const totalPending = event.roleRequirements.reduce((sum, r) => sum + r.pending, 0);

          return (
            <Card key={event.id}>
              <CardContent className="py-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        📍 {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {eventDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        🕐 {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        🏙️ {event.city}
                      </span>
                    </div>

                    {/* Role Requirements */}
                    <div className="flex flex-wrap gap-2">
                      {event.roleRequirements.map((req) => (
                        <div 
                          key={req.role} 
                          className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
                        >
                          <span className="capitalize font-medium">{req.role}</span>
                          <span className="text-gray-500 ml-2">
                            {req.filled}/{req.quantity}
                            {req.pending > 0 && (
                              <span className="text-yellow-600 ml-1">({req.pending} pending)</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    {/* Staffing Progress */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Staffing Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(totalFilled / totalRequired) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{totalFilled}/{totalRequired}</span>
                      </div>
                      {totalPending > 0 && (
                        <p className="text-xs text-yellow-600 mt-1">{totalPending} pending responses</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">View Details</Button>
                      <Button variant="secondary" size="sm">Chat</Button>
                      <Button size="sm">Dispatch Staff</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-lg font-semibold">Create New Event</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input 
                  type="text" 
                  placeholder="Corporate Party"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  placeholder="Event details..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>San Francisco</option>
                    <option>Oakland</option>
                    <option>San Jose</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="123 Main St, San Francisco"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Roles</label>
                <div className="space-y-2">
                  {['bartender', 'server', 'kitchen', 'coordinator', 'security'].map(role => (
                    <div key={role} className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="capitalize flex-1">{role}</span>
                      <input 
                        type="number" 
                        min="1" 
                        defaultValue="1"
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
