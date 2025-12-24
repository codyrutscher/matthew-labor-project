'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { StaffRole } from '@/types';

interface StaffMember {
  id: string;
  email: string;
  name: string;
  staff_profiles: {
    staff_roles: StaffRole[];
    city: string;
    status: 'available' | 'assigned' | 'unavailable';
  }[] | null;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    city: 'San Francisco',
    staffRoles: [] as StaffRole[],
  });
  const [inviteUrl, setInviteUrl] = useState('');
  const [inviting, setInviting] = useState(false);

  const roles: StaffRole[] = ['bartender', 'server', 'kitchen', 'coordinator', 'security'];

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        staff_profiles (
          staff_roles,
          city,
          status
        )
      `)
      .eq('role', 'staff');

    if (!error && data) {
      setStaff(data as StaffMember[]);
    }
    setLoading(false);
  }

  const cities = [...new Set(staff.map(s => s.staff_profiles?.[0]?.city).filter(Boolean))] as string[];

  const filteredStaff = staff.filter(member => {
    const profile = member.staff_profiles?.[0];
    if (!profile) return false;
    if (filterCity !== 'all' && profile.city !== filterCity) return false;
    if (filterRole !== 'all' && !profile.staff_roles.includes(filterRole as StaffRole)) return false;
    if (filterStatus !== 'all' && profile.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'assigned':
        return <Badge variant="info">Assigned</Badge>;
      case 'unavailable':
        return <Badge variant="default">Unavailable</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleInvite = async () => {
    if (!inviteForm.email || inviteForm.staffRoles.length === 0) return;

    setInviting(true);
    try {
      const res = await fetch('/api/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      });

      const data = await res.json();

      if (data.success) {
        setInviteUrl(data.inviteUrl);
      } else {
        alert('Failed to create invite');
      }
    } catch (err) {
      alert('Error creating invite');
    }
    setInviting(false);
  };

  const toggleRole = (role: StaffRole) => {
    setInviteForm(prev => ({
      ...prev,
      staffRoles: prev.staffRoles.includes(role)
        ? prev.staffRoles.filter(r => r !== role)
        : [...prev.staffRoles, role],
    }));
  };

  const availableCount = staff.filter(s => s.staff_profiles?.[0]?.status === 'available').length;
  const assignedCount = staff.filter(s => s.staff_profiles?.[0]?.status === 'assigned').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading staff...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Labor Pool</h1>
          <p className="text-slate-600 mt-1">Manage your staff members</p>
        </div>
        <Button onClick={() => { setShowInviteModal(true); setInviteUrl(''); }}>
          + Invite Staff
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm font-medium text-slate-600">Total Staff</p>
            <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm font-medium text-slate-600">Available</p>
            <p className="text-2xl font-bold text-green-600">{availableCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm font-medium text-slate-600">Currently Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Staff Members</h2>
            <span className="text-sm text-slate-600">{filteredStaff.length} members</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {filteredStaff.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Roles</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-semibold">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-600">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {member.staff_profiles?.[0]?.staff_roles.map(role => (
                          <Badge key={role} variant="info" className="capitalize">{role}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{member.staff_profiles?.[0]?.city}</td>
                    <td className="px-6 py-4">
                      {member.staff_profiles?.[0] && getStatusBadge(member.staff_profiles[0].status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Message</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-600">
              {staff.length === 0
                ? 'No staff members yet. Invite your first staff member to get started.'
                : 'No staff members match your filters.'}
            </div>
          )}
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Invite New Staff</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {inviteUrl ? (
                <>
                  <p className="text-green-700 font-medium">Invite created!</p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Share this link with the staff member:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteUrl}
                        readOnly
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-900"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => navigator.clipboard.writeText(inviteUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setShowInviteModal(false)}>
                    Done
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="staff@example.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role Type(s)</label>
                    <div className="space-y-2">
                      {roles.map(role => (
                        <label key={role} className="flex items-center gap-2 text-slate-700">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={inviteForm.staffRoles.includes(role)}
                            onChange={() => toggleRole(role)}
                          />
                          <span className="capitalize">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <select
                      value={inviteForm.city}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                    >
                      <option>San Francisco</option>
                      <option>Oakland</option>
                      <option>San Jose</option>
                    </select>
                  </div>
                  <p className="text-sm text-slate-600">
                    Staff will receive an invite link to complete onboarding.
                  </p>
                  <div className="flex gap-2 pt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowInviteModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleInvite}
                      disabled={inviting || !inviteForm.email || inviteForm.staffRoles.length === 0}
                    >
                      {inviting ? 'Creating...' : 'Create Invite'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
