'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { StaffRole } from '@/types';

interface RoleRequirement {
  role: StaffRole;
  quantity: number;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  status: 'draft' | 'open' | 'live' | 'completed';
  event_role_requirements: RoleRequirement[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    city: 'San Francisco',
    roles: {} as Partial<Record<StaffRole, number>>,
  });

  const roles: StaffRole[] = ['bartender', 'server', 'kitchen', 'coordinator', 'security'];

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_role_requirements (
          role,
          quantity
        )
      `)
      .order('date', { ascending: true });

    if (!error && data) {
      setEvents(data as Event[]);
    }
    setLoading(false);
  }

  async function handleCreateEvent() {
    if (!formData.title || !formData.date || !formData.start_time || !formData.end_time || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    const supabase = createClient();

    // Get current user ID (would come from auth in real app)
    const { data: { user } } = await supabase.auth.getUser();

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location,
        city: formData.city,
        status: 'draft',
        created_by: user?.id || 'admin',
      })
      .select()
      .single();

    if (error) {
      alert('Failed to create event');
      setCreating(false);
      return;
    }

    // Add role requirements
    const roleRequirements = Object.entries(formData.roles)
      .filter(([_, qty]) => qty > 0)
      .map(([role, quantity]) => ({
        event_id: event.id,
        role: role as StaffRole,
        quantity,
      }));

    if (roleRequirements.length > 0) {
      await supabase.from('event_role_requirements').insert(roleRequirements);
    }

    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      city: 'San Francisco',
      roles: {} as Partial<Record<StaffRole, number>>,
    });
    setCreating(false);
    fetchEvents();
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-600 mt-1">Manage upcoming events and staffing</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ Create Event</Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const totalRequired = event.event_role_requirements?.reduce((sum, r) => sum + r.quantity, 0) || 0;

            return (
              <Card key={event.id}>
                <CardContent className="py-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      {event.description && (
                        <p className="text-slate-700 mb-3">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                        <span className="flex items-center gap-1">
                          📍 {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          📅 {eventDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          🕐 {event.start_time} - {event.end_time}
                        </span>
                        <span className="flex items-center gap-1">
                          🏙️ {event.city}
                        </span>
                      </div>

                      {/* Role Requirements */}
                      {event.event_role_requirements && event.event_role_requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.event_role_requirements.map((req) => (
                            <div
                              key={req.role}
                              className="bg-slate-100 rounded-lg px-3 py-2 text-sm"
                            >
                              <span className="capitalize font-medium text-slate-900">{req.role}</span>
                              <span className="text-slate-600 ml-2">×{req.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 mb-1">Staff Needed</p>
                        <p className="text-2xl font-bold text-slate-900">{totalRequired}</p>
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
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">No events yet. Create your first event to get started.</p>
            <Button onClick={() => setShowCreateModal(true)}>+ Create Event</Button>
          </CardContent>
        </Card>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Create New Event</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="Corporate Party"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  placeholder="Event details..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  >
                    <option>San Francisco</option>
                    <option>Oakland</option>
                    <option>San Jose</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  placeholder="123 Main St, San Francisco"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Required Roles</label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <div key={role} className="flex items-center gap-3">
                      <span className="capitalize flex-1 text-slate-700">{role}</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.roles[role] || 0}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          roles: { ...prev.roles, [role]: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-20 border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateEvent} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
