'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockEvents, mockDispatchRequests, mockStaff } from '@/lib/mockData';
import { StaffRole } from '@/types';

export default function DispatchPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const getDispatchesForEvent = (eventId: string) => {
    return mockDispatchRequests.filter(d => d.eventId === eventId);
  };

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

  const getRoleSlotStatus = (eventId: string, role: StaffRole) => {
    const event = mockEvents.find(e => e.id === eventId);
    const requirement = event?.roleRequirements.find(r => r.role === role);
    if (!requirement) return null;

    const dispatches = mockDispatchRequests.filter(
      d => d.eventId === eventId && d.staffRole === role
    );
    const filled = dispatches.filter(d => d.status === 'accepted').length;
    const pending = dispatches.filter(d => d.status === 'pending').length;
    const unfilled = requirement.quantity - filled - pending;

    return { filled, pending, unfilled, total: requirement.quantity };
  };

  const selectedEventData = mockEvents.find(e => e.id === selectedEvent);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
        <p className="text-gray-500 mt-1">Manage staff assignments for events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Events</h2>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-200">
                {mockEvents.map((event) => {
                  const isSelected = selectedEvent === event.id;
                  const totalRequired = event.roleRequirements.reduce((sum, r) => sum + r.quantity, 0);
                  const totalFilled = event.roleRequirements.reduce((sum, r) => sum + r.filled, 0);

                  return (
                    <li
                      key={event.id}
                      onClick={() => setSelectedEvent(event.id)}
                      className={`px-4 py-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <Badge variant={event.status === 'open' ? 'success' : event.status === 'live' ? 'info' : 'default'}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} • {event.city}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(totalFilled / totalRequired) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{totalFilled}/{totalRequired}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
                      <h2 className="text-lg font-semibold">{selectedEventData.title}</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedEventData.date).toLocaleDateString()} • {selectedEventData.startTime} - {selectedEventData.endTime}
                      </p>
                    </div>
                    <Button onClick={() => setShowDispatchModal(true)}>+ Send Job Request</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Role Requirements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedEventData.roleRequirements.map((req) => {
                      const status = getRoleSlotStatus(selectedEventData.id, req.role);
                      return (
                        <div key={req.role} className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium capitalize text-gray-900">{req.role}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">Filled</span>
                              <span>{status?.filled || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-yellow-600">Pending</span>
                              <span>{status?.pending || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Unfilled</span>
                              <span>{status?.unfilled || req.quantity}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Need {req.quantity} total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Staff Assignments */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Staff Assignments</h2>
                </CardHeader>
                <CardContent className="p-0">
                  {getDispatchesForEvent(selectedEvent!).length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getDispatchesForEvent(selectedEvent!).map((dispatch) => {
                          const staff = mockStaff.find(s => s.id === dispatch.staffId);
                          return (
                            <tr key={dispatch.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-sm font-medium">
                                      {staff?.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{staff?.name}</p>
                                    <p className="text-xs text-gray-500">{staff?.city}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 capitalize text-gray-600">{dispatch.staffRole}</td>
                              <td className="px-6 py-4">{getStatusBadge(dispatch.status)}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(dispatch.sentAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                {dispatch.status === 'pending' && (
                                  <Button variant="ghost" size="sm">Resend</Button>
                                )}
                                {dispatch.status === 'accepted' && (
                                  <Button variant="ghost" size="sm">Message</Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No staff assigned yet. Send job requests to fill roles.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-gray-500">Select an event to view dispatch details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dispatch Modal - simplified for now */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Send Job Request</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Bartender</option>
                  <option>Server</option>
                  <option>Kitchen</option>
                  <option>Coordinator</option>
                  <option>Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>San Francisco</option>
                  <option>Oakland</option>
                  <option>San Jose</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Staff</label>
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {mockStaff.filter(s => s.status === 'available').map(staff => (
                    <label key={staff.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="font-medium">{staff.name}</span>
                      <span className="text-sm text-gray-500">{staff.city}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowDispatchModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowDispatchModal(false)}>
                  Send Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
