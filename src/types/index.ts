// User types
export type UserRole = 'admin' | 'staff' | 'client' | 'vendor';

export type StaffRole = 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security';

export type StaffStatus = 'available' | 'assigned' | 'unavailable';

export type DispatchStatus = 'pending' | 'accepted' | 'declined';

export type RoleSlotStatus = 'unfilled' | 'pending' | 'filled';

export type EventStatus = 'draft' | 'open' | 'live' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Staff extends User {
  role: 'staff';
  staffRoles: StaffRole[];
  city: string;
  status: StaffStatus;
  phone?: string;
}

// Role requirement for an event
export interface RoleRequirement {
  role: StaffRole;
  quantity: number;
  filled: number;
  pending: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  clientId?: string;
  vendorId?: string;
  createdBy: string;
  createdAt: Date;
  status: EventStatus;
  roleRequirements: RoleRequirement[];
}

export interface DispatchRequest {
  id: string;
  eventId: string;
  staffId: string;
  staffRole: StaffRole;
  status: DispatchStatus;
  sentAt: Date;
  respondedAt?: Date;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  isPrivate?: boolean; // for 1:1 admin-staff chat
}
