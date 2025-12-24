'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface JobRequest {
  id: string;
  event_id: string;
  staff_role: string;
  status: 'pending' | 'accepted' | 'declined';
  sent_at: string;
  responded_at: string | null;
  events: {
    id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    city: string;
  } | null;
}

export default function JobsPage() {
  const [pendingJobs, setPendingJobs] = useState<JobRequest[]>([]);
  const [acceptedJobs, setAcceptedJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscription for new job requests
    const supabase = createClient();
    const channel = supabase
      .channel('job-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dispatch_requests',
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchJobs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('dispatch_requests')
      .select(`
        id, event_id, staff_role, status, sent_at, responded_at,
        events (id, title, date, start_time, end_time, location, city)
      `)
      .eq('staff_id', user.id)
      .order('sent_at', { ascending: false });

    if (data) {
      const jobs = data as unknown as JobRequest[];
      setPendingJobs(jobs.filter(j => j.status === 'pending'));
      setAcceptedJobs(jobs.filter(j => j.status === 'accepted'));
    }
    setLoading(false);
  }

  async function handleRespond(jobId: string, accept: boolean) {
    setResponding(jobId);
    const supabase = createClient();

    const { error } = await supabase
      .from('dispatch_requests')
      .update({
        status: accept ? 'accepted' : 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (error) {
      alert('Failed to respond to job request');
    } else {
      // If accepted, update staff status to assigned
      if (accept) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('staff_profiles')
            .update({ status: 'assigned' })
            .eq('id', user.id);
        }
      }
      fetchJobs();
    }
    setResponding(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-slate-600 mt-1">View and respond to job requests</p>
      </div>

      {/* Pending Job Requests */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Pending Requests
          {pendingJobs.length > 0 && (
            <Badge variant="warning" className="ml-2">{pendingJobs.length}</Badge>
          )}
        </h2>

        {pendingJobs.length > 0 ? (
          <div className="grid gap-4">
            {pendingJobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-amber-500">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.events?.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Role: <span className="capitalize font-medium">{job.staff_role}</span>
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                        <span>📅 {job.events?.date ? new Date(job.events.date).toLocaleDateString() : 'TBD'}</span>
                        <span>🕐 {job.events?.start_time} - {job.events?.end_time}</span>
                        <span>📍 {job.events?.location}</span>
                        <span>🏙️ {job.events?.city}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleRespond(job.id, false)}
                        disabled={responding === job.id}
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => handleRespond(job.id, true)}
                        disabled={responding === job.id}
                      >
                        {responding === job.id ? 'Processing...' : 'Accept'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-slate-600">
              No pending job requests. Check back later!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Accepted Jobs */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          My Upcoming Events
          {acceptedJobs.length > 0 && (
            <Badge variant="success" className="ml-2">{acceptedJobs.length}</Badge>
          )}
        </h2>

        {acceptedJobs.length > 0 ? (
          <div className="grid gap-4">
            {acceptedJobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-green-500">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{job.events?.title}</h3>
                        <Badge variant="success">Confirmed</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Role: <span className="capitalize font-medium">{job.staff_role}</span>
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                        <span>📅 {job.events?.date ? new Date(job.events.date).toLocaleDateString() : 'TBD'}</span>
                        <span>🕐 {job.events?.start_time} - {job.events?.end_time}</span>
                        <span>📍 {job.events?.location}</span>
                        <span>🏙️ {job.events?.city}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Open Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-slate-600">
              No upcoming events. Accept a job request to get started!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
