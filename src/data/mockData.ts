import { faker } from '@faker-js/faker';
import { Club, User, ClubMember, Announcement, MeetingSchedule } from '../types';

// Updated club names to be more specific and engaging
const clubNames = [
  'Fashion & Design Society',
  'Yoga & Wellness Circle',
  'The Coding Crew',
  'Rhythm & Moves Dance Troupe',
  'NSS Community Volunteers',
  'AIT Music Hub'
];

// High-quality, relevant images for the specified clubs
const clubImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop', // Fashion
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', // Yoga
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', // Coding
  'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=300&fit=crop', // Dance (Updated)
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=400&h=300&fit=crop', // NSS
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop'  // Music
];

// Function to generate realistic club descriptions
function getClubDescription(clubName: string): string {
  const descriptions: { [key: string]: string } = {
    'Fashion & Design Society': 'Express your creativity and explore the world of fashion. We host design workshops, runway shows, and discussions on sustainable fashion.',
    'Yoga & Wellness Circle': 'Find balance and inner peace. Join our daily yoga sessions, meditation workshops, and discussions on holistic wellness.',
    'The Coding Crew': 'A community for passionate programmers. We tackle coding challenges, build projects, and explore new technologies together.',
    'Rhythm & Moves Dance Troupe': 'Express yourself through movement. Our club embraces all forms of dance, from classical to hip-hop, performing at cultural fests and competitions.',
    'NSS Community Volunteers': 'The National Service Scheme unit dedicated to community service, social welfare, and creating a positive impact through volunteer work.',
    'AIT Music Hub': 'The heart of campus culture. From acoustic nights to band performances, we provide a platform for musicians and vocalists to shine.'
  };
  
  return descriptions[clubName] || faker.lorem.paragraph(3);
}

// Function to get club category
function getClubCategory(clubName: string): string {
    const categoryMap: { [key: string]: string } = {
        'Fashion & Design Society': 'Arts',
        'Yoga & Wellness Circle': 'Special Interest',
        'The Coding Crew': 'Technical',
        'Rhythm & Moves Dance Troupe': 'Cultural',
        'NSS Community Volunteers': 'Community Service',
        'AIT Music Hub': 'Cultural'
    };
    return categoryMap[clubName] || 'Special Interest';
}

// Function to generate relevant tags for clubs
function getClubTags(clubName: string): string[] {
    const tagMap: { [key: string]: string[] } = {
        'Fashion & Design Society': ['Design', 'Styling', 'Runway', 'Textiles'],
        'Yoga & Wellness Circle': ['Yoga', 'Meditation', 'Wellness', 'Mindfulness'],
        'The Coding Crew': ['Programming', 'Web Dev', 'Algorithms', 'Projects'],
        'Rhythm & Moves Dance Troupe': ['Choreography', 'Hip-Hop', 'Contemporary', 'Performance'],
        'NSS Community Volunteers': ['Social Work', 'Volunteering', 'Community', 'Awareness'],
        'AIT Music Hub': ['Performance', 'Jamming', 'Vocals', 'Instruments']
    };
  
  return tagMap[clubName] || faker.helpers.arrayElements(['student-run', 'workshops'], { min: 1, max: 2 });
}

// Generate mock clubs with the new data
export const mockClubs: Club[] = clubNames.map((name, index) => ({
  id: faker.string.uuid(),
  name,
  description: getClubDescription(name),
  category: getClubCategory(name),
  contactEmail: faker.internet.email({ firstName: name.split(' ')[0], provider: 'drait.edu' }),
  leaderId: faker.string.uuid(),
  leaderName: faker.person.fullName(),
  memberCount: faker.number.int({ min: 25, max: 150 }),
  meetingSchedule: `${faker.date.weekday()}s at ${faker.number.int({ min: 4, max: 7 })}:30 PM`,
  location: `Room ${faker.number.int({ min: 101, max: 404 })} / Open Grounds`,
  isRecruiting: faker.datatype.boolean(0.8),
  tags: getClubTags(name),
  createdAt: faker.date.past().toISOString(),
  image: clubImages[index % clubImages.length]
}));

// Generate mock users (can remain the same)
export const mockUsers: User[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['student', 'leader']),
  avatar: faker.image.avatar()
}));

// Generate mock club members, announcements, and schedules based on the new clubs
export const mockClubMembers: ClubMember[] = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  userId: faker.helpers.arrayElement(mockUsers).id,
  userName: faker.person.fullName(),
  userEmail: faker.internet.email(),
  status: faker.helpers.arrayElement(['active', 'pending', 'inactive']),
  joinedAt: faker.date.past().toISOString()
}));

export const mockAnnouncements: Announcement[] = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  createdAt: faker.date.recent().toISOString(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'])
}));

export const mockMeetingSchedules: MeetingSchedule[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  title: faker.lorem.sentence({ min: 3, max: 6 }),
  description: faker.lorem.paragraph(),
  date: faker.date.future().toDateString(),
  time: `${faker.number.int({ min: 9, max: 18 })}:${faker.helpers.arrayElement(['00', '30'])}`,
  location: `Room ${faker.number.int({ min: 100, max: 999 })}`,
  type: faker.helpers.arrayElement(['meeting', 'event', 'workshop'])
}));
