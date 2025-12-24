'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockStaff, mockEvents, mockDispatchRequests } from '@/lib/mockData';

export default function DashboardPage() {
  const activeStaff = mockStaff.filter(s => s.status === 'available').length;
  const pendingDispatches = mockDispatchRequests.filter(d => d.status === 'pending').length;
  const upcomingEvents = mockEvents.filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your labor operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Active Staff</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activeStaff}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Pending Dispatches</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingDispatches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Staff</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{mockStaff.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events & Pending Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {mockEvents.slice(0, 3).map((event) => (
                <li key={event.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <Badge variant="info">{event.city}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Pending Dispatch Requests</h2>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {mockDispatchRequests
                .filter(d => d.status === 'pending')
                .map((dispatch) => {
                  const staff = mockStaff.find(s => s.id === dispatch.staffId);
                  const event = mockEvents.find(e => e.id === dispatch.eventId);
                  return (
                    <li key={dispatch.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{staff?.name}</p>
                          <p className="text-sm text-gray-500">{event?.title}</p>
                        </div>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{dispatch.staffRole}</p>
                    </li>
                  );
                })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
