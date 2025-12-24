'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockStaff } from '@/lib/mockData';
import { StaffRole } from '@/types';

export default function StaffPage() {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const cities = [...new Set(mockStaff.map(s => s.city))];
  const roles: StaffRole[] = ['bartender', 'server', 'kitchen', 'coordinator', 'security'];

  const filteredStaff = mockStaff.filter(staff => {
    if (filterCity !== 'all' && staff.city !== filterCity) return false;
    if (filterRole !== 'all' && !staff.staffRoles.includes(filterRole as StaffRole)) return false;
    if (filterStatus !== 'all' && staff.status !== filterStatus) return false;
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

  const availableCount = mockStaff.filter(s => s.status === 'available').length;
  const assignedCount = mockStaff.filter(s => s.status === 'assigned').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labor Pool</h1>
          <p className="text-gray-500 mt-1">Manage your staff members</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>+ Invite Staff</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Total Staff</p>
            <p className="text-2xl font-bold">{mockStaff.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Available</p>
            <p className="text-2xl font-bold text-green-600">{availableCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Currently Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <h2 className="text-lg font-semibold">Staff Members</h2>
            <span className="text-sm text-gray-500">{filteredStaff.length} members</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{staff.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {staff.staffRoles.map(role => (
                        <Badge key={role} variant="info" className="capitalize">{role}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{staff.city}</td>
                  <td className="px-6 py-4">{getStatusBadge(staff.status)}</td>
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
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Invite New Staff</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="staff@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Type(s)</label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>San Francisco</option>
                  <option>Oakland</option>
                  <option>San Jose</option>
                </select>
              </div>
              <p className="text-sm text-gray-500">
                Staff will receive an email invite to complete onboarding and will enter the pool as "Available" once complete.
              </p>
              <div className="flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
