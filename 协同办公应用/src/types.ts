export type TabType = 'home' | 'meeting' | 'approval' | 'document' | 'attendance' | 'travel' | 'reimbursement' | 'doc_admin' | 'team_attendance';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'employee' | 'manager' | 'admin';
  department: string;
  position: string;
}

export interface Task {
  id: string;
  type: 'approval' | 'meeting' | 'trip' | 'attendance';
  title: string;
  description: string;
  time: string;
  status: 'pending' | 'urgent' | 'info';
  meetingRoomId?: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  equipment: string[];
  distance: string;
  status: 'available' | 'occupied' | 'booked';
}

export interface Approval {
  id: string;
  type: 'leave' | 'trip' | 'reimbursement' | 'purchase';
  title: string;
  initiator: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  content: any;
}

export interface Document {
  id: string;
  title: string;
  category: 'policy' | 'business' | 'project' | 'process';
  publisher: string;
  time: string;
  views: number;
  isLatest: boolean;
  content: string;
  tags: string[];
  summary?: string;
  status?: 'active' | 'expired';
  version?: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  time: string;
  transport: string;
  hotel: string;
  status: 'booked' | 'completed';
}
