'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface DashboardStats {
  totalStaff: number;
  availableStaff: number;
  upcomingEvents: number;
  pendingDispatches: number;
}

interface Event {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface DispatchRequest {
  id: string;
  status: string;
  staff_role: string;
  profiles: { name: string } | null;
  events: { title: string } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    availableStaff: 0,
    upcomingEvents: 0,
    pendingDispatches: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [pendingDispatches, setPendingDispatches] = useState<DispatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch staff counts
      const { count: totalStaff } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff');

      const { count: availableStaff } = await supabase
        .from('staff_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Fetch upcoming events
      const today = new Date().toISOString().split('T')[0];
      const { data: eventsData, count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(5);

      // Fetch pending dispatches
      const { data: dispatchData, count: pendingCount } = await supabase
        .from('dispatch_requests')
        .select(`
          id,
          status,
          staff_role,
          profiles:staff_id (name),
          events:event_id (title)
        `, { count: 'exact' })
        .eq('status', 'pending')
        .limit(5);

      setStats({
        totalStaff: totalStaff || 0,
        availableStaff: availableStaff || 0,
        upcomingEvents: upcomingEvents || 0,
        pendingDispatches: pendingCount || 0,
      });

      setEvents(eventsData || []);
      setPendingDispatches((dispatchData as unknown as DispatchRequest[]) || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your labor operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-600">Available Staff</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.availableStaff}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-600">Upcoming Events</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.upcomingEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-600">Pending Dispatches</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pendingDispatches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-600">Total Staff</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalStaff}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events & Pending Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {events.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {events.map((event) => (
                  <li key={event.id} className="px-6 py-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{event.title}</p>
                        <p className="text-sm text-slate-600">{event.location}</p>
                      </div>
                      <Badge variant="info">{event.city}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      {new Date(event.date).toLocaleDateString()} • {event.start_time} - {event.end_time}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center text-slate-600">
                No upcoming events. Create your first event to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Pending Dispatch Requests</h2>
              <Link href="/dispatch" className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pendingDispatches.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {pendingDispatches.map((dispatch) => (
                  <li key={dispatch.id} className="px-6 py-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{dispatch.profiles?.name || 'Unknown'}</p>
                        <p className="text-sm text-slate-600">{dispatch.events?.title || 'Unknown Event'}</p>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 capitalize">{dispatch.staff_role}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center text-slate-600">
                No pending dispatch requests.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
