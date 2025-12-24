'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { StaffRole } from '@/types';

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  city: string;
  status: string;
  event_role_requirements: { role: StaffRole; quantity: number }[];
}

interface DispatchRequest {
  id: string;
  event_id: string;
  staff_id: string;
  staff_role: StaffRole;
  status: 'pending' | 'accepted' | 'declined';
  sent_at: string;
  profiles: { name: string; email: string } | null;
}

interface AvailableStaff {
  id: string;
  name: string;
  email: string;
  staff_profiles: { city: string; staff_roles: StaffRole[] }[];
}

export default function DispatchPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [dispatches, setDispatches] = useState<DispatchRequest[]>([]);
  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    role: '' as StaffRole | '',
    selectedStaff: [] as string[],
  });
  const [sending, setSending] = useState(false);

  const roles: StaffRole[] = ['bartender', 'server', 'kitchen', 'coordinator', 'security'];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchDispatches(selectedEvent);
    }
  }, [selectedEvent]);

  async function fetchEvents() {
    const supabase = createClient();
    const { data } = await supabase
      .from('events')
      .select(`
        id, title, date, start_time, end_time, city, status,
        event_role_requirements (role, quantity)
      `)
      .in('status', ['draft', 'open', 'live'])
      .order('date', { ascending: true });

    if (data) {
      setEvents(data as Event[]);
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0].id);
      }
    }
    setLoading(false);
  }

  async function fetchDispatches(eventId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('dispatch_requests')
      .select(`
        id, event_id, staff_id, staff_role, status, sent_at,
        profiles:staff_id (name, email)
      `)
      .eq('event_id', eventId)
      .order('sent_at', { ascending: false });

    if (data) {
      setDispatches(data as unknown as DispatchRequest[]);
    }
  }

  async function fetchAvailableStaff(role: StaffRole, city: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select(`
        id, name, email,
        staff_profiles!inner (city, staff_roles, status)
      `)
      .eq('role', 'staff')
      .eq('staff_profiles.status', 'available')
      .eq('staff_profiles.city', city)
      .contains('staff_profiles.staff_roles', [role]);

    if (data) {
      setAvailableStaff(data as unknown as AvailableStaff[]);
    }
  }

  async function handleSendDispatch() {
    if (!selectedEvent || !dispatchForm.role || dispatchForm.selectedStaff.length === 0) return;

    setSending(true);
    const supabase = createClient();

    const requests = dispatchForm.selectedStaff.map(staffId => ({
      event_id: selectedEvent,
      staff_id: staffId,
      staff_role: dispatchForm.role,
      status: 'pending' as const,
    }));

    const { error } = await supabase.from('dispatch_requests').insert(requests);

    if (error) {
      alert('Failed to send dispatch requests');
    } else {
      setShowDispatchModal(false);
      setDispatchForm({ role: '', selectedStaff: [] });
      fetchDispatches(selectedEvent);
    }
    setSending(false);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Filled</Badge>;
      case 'declined':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  const getRoleStats = (eventId: string, role: StaffRole) => {
    const event = events.find(e => e.id === eventId);
    const requirement = event?.event_role_requirements?.find(r => r.role === role);
    const eventDispatches = dispatches.filter(d => d.staff_role === role);
    const filled = eventDispatches.filter(d => d.status === 'accepted').length;
    const pending = eventDispatches.filter(d => d.status === 'pending').length;
    const needed = requirement?.quantity || 0;
    return { filled, pending, unfilled: Math.max(0, needed - filled - pending), needed };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading dispatch board...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dispatch Board</h1>
        <p className="text-slate-600 mt-1">Manage staff assignments for events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Events</h2>
            </CardHeader>
            <CardContent className="p-0">
              {events.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {events.map((event) => {
                    const isSelected = selectedEvent === event.id;
                    const totalNeeded = event.event_role_requirements?.reduce((sum, r) => sum + r.quantity, 0) || 0;

                    return (
                      <li
                        key={event.id}
                        onClick={() => setSelectedEvent(event.id)}
                        className={`px-4 py-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-slate-900">{event.title}</p>
                          <Badge variant={event.status === 'open' ? 'success' : event.status === 'live' ? 'info' : 'default'}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {new Date(event.date).toLocaleDateString()} • {event.city}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {totalNeeded} staff needed
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-slate-600">
                  No events to dispatch. Create an event first.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dispatch Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEventData ? (
            <>
              {/* Role Requirements Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{selectedEventData.title}</h2>
                      <p className="text-sm text-slate-600">
                        {new Date(selectedEventData.date).toLocaleDateString()} • {selectedEventData.start_time} - {selectedEventData.end_time}
                      </p>
                    </div>
                    <Button onClick={() => {
                      setShowDispatchModal(true);
                      setDispatchForm({ role: '', selectedStaff: [] });
                    }}>
                      + Send Job Request
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Role Requirements</h3>
                  {selectedEventData.event_role_requirements && selectedEventData.event_role_requirements.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedEventData.event_role_requirements.map((req) => {
                        const stats = getRoleStats(selectedEventData.id, req.role);
                        return (
                          <div key={req.role} className="bg-slate-50 rounded-lg p-4">
                            <p className="font-medium capitalize text-slate-900">{req.role}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-700">Filled</span>
                                <span className="text-slate-900">{stats.filled}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-amber-700">Pending</span>
                                <span className="text-slate-900">{stats.pending}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Unfilled</span>
                                <span className="text-slate-900">{stats.unfilled}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <span className="text-xs text-slate-600">Need {req.quantity} total</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-600">No role requirements set for this event.</p>
                  )}
                </CardContent>
              </Card>

              {/* Staff Assignments */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-slate-900">Staff Assignments</h2>
                </CardHeader>
                <CardContent className="p-0">
                  {dispatches.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Staff</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {dispatches.map((dispatch) => (
                          <tr key={dispatch.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-700 text-sm font-semibold">
                                    {dispatch.profiles?.name?.charAt(0) || '?'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{dispatch.profiles?.name || 'Unknown'}</p>
                                  <p className="text-xs text-slate-600">{dispatch.profiles?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 capitalize text-slate-700">{dispatch.staff_role}</td>
                            <td className="px-6 py-4">{getStatusBadge(dispatch.status)}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(dispatch.sent_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-8 text-center text-slate-600">
                      No staff assigned yet. Send job requests to fill roles.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-slate-600">Select an event to view dispatch details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && selectedEventData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Send Job Request</h2>
              <p className="text-sm text-slate-600">{selectedEventData.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Type</label>
                <select
                  value={dispatchForm.role}
                  onChange={(e) => {
                    const role = e.target.value as StaffRole;
                    setDispatchForm(prev => ({ ...prev, role, selectedStaff: [] }));
                    if (role) {
                      fetchAvailableStaff(role, selectedEventData.city);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role} value={role} className="capitalize">{role}</option>
                  ))}
                </select>
              </div>

              {dispatchForm.role && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Staff in {selectedEventData.city}
                  </label>
                  {availableStaff.length > 0 ? (
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {availableStaff.map(staff => (
                        <label key={staff.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={dispatchForm.selectedStaff.includes(staff.id)}
                            onChange={(e) => {
                              setDispatchForm(prev => ({
                                ...prev,
                                selectedStaff: e.target.checked
                                  ? [...prev.selectedStaff, staff.id]
                                  : prev.selectedStaff.filter(id => id !== staff.id)
                              }));
                            }}
                          />
                          <span className="font-medium text-slate-900">{staff.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 py-4 text-center border rounded-lg">
                      No available staff with this role in {selectedEventData.city}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowDispatchModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSendDispatch}
                  disabled={sending || !dispatchForm.role || dispatchForm.selectedStaff.length === 0}
                >
                  {sending ? 'Sending...' : `Send to ${dispatchForm.selectedStaff.length} Staff`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
