export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  meetingSchedule: string;
  location: string;
  isRecruiting: boolean;
  tags: string[];
  createdAt: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'leader';
  avatar?: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  title: string;
  content: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MeetingSchedule {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'event' | 'workshop';
}
