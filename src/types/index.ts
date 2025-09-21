export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string;
  leaderId: string;
  leaderName: string;
  leaderAvatar?: string;
  memberCount: number;
  meetingSchedule: string;
  location: string;
  isRecruiting: boolean;
  tags: string[];
  createdAt: string;
  image?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  logoUrl?: string;
  activityScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from lucide-react
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'leader' | 'admin';
  avatar?: string;
  usn?: string;
  branch?: string;
  contact?: string;
  interests?: string[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  contributionPoints: number;
  achievements?: Achievement[];
}

export interface ClubMember {
  id:string;
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
  type: 'meeting' | 'event' | 'workshop' | 'audition' | 'performance' | 'talk';
  hostingClub: string;
  auditionInfo?: string;
  ticketUrl?: string;
}

export interface Notification {
  id: string;
  content: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  uploadedAt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    image: string;
    quote: string;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  icon: string;
}
