import { Faker, en_IN, en } from '@faker-js/faker';
import { Club, User, ClubMember, Announcement, MeetingSchedule, Notification, GalleryImage, Testimonial, Achievement, ImpactStat } from '../types';

const faker = new Faker({ locale: [en_IN, en] });

export const LEADER_USER_ID = 'leader-main-account-id';
export const STUDENT_USER_ID = 'student-main-account-id';

const clubNames = [
  'Fashion & Design Society',
  'Yoga & Wellness Circle',
  'The Coding Crew',
  'Rhythm & Moves Dance Troupe',
  'NSS Community Volunteers',
  'AIT Music Hub'
];

const clubImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop', // Fashion
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', // Yoga
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', // Coding
  'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=300&fit=crop', // Dance
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=400&h=300&fit=crop', // NSS
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop'  // Music
];

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

const allAchievements: Achievement[] = [
    { id: 'ach-1', name: 'Club Starter', description: 'Joined your first club', icon: 'Rocket' },
    { id: 'ach-2', name: 'Active Contributor', description: 'Reached 250 contribution points', icon: 'Star' },
    { id: 'ach-3', name: 'Super Contributor', description: 'Reached 750 contribution points', icon: 'Trophy' },
    { id: 'ach-4', name: 'Event Enthusiast', description: 'Attended 5 club events', icon: 'CalendarCheck' },
];

const requestedLeaders = [
    { id: 'leader-1', name: 'Chinmay', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
    { id: 'leader-2', name: 'Sumant', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: 'leader-3', name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { id: 'leader-4', name: 'Nandana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
    { id: 'leader-5', name: 'Anita', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face' },
    { id: 'leader-6', name: 'Rosie', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face' },
];

const mainLeader = { id: LEADER_USER_ID, name: 'Alex Johnson', email: 'leader@123', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face' };

const staticUsers: User[] = [
    ...requestedLeaders.map(leader => ({
        id: leader.id,
        name: leader.name,
        email: `${leader.name.toLowerCase()}@example.com`,
        role: 'leader' as const,
        password: 'password123',
        avatar: leader.avatar,
        contact: faker.phone.number(),
        contributionPoints: faker.number.int({ min: 500, max: 1000 }),
        socials: {
            twitter: `https://twitter.com/${leader.name.toLowerCase()}`,
            linkedin: `https://linkedin.com/in/${leader.name.toLowerCase()}`,
            website: faker.internet.url(),
        }
    })),
    {
        id: mainLeader.id,
        name: mainLeader.name,
        email: mainLeader.email,
        role: 'leader',
        password: 'password123',
        avatar: mainLeader.avatar,
        contact: faker.phone.number(),
        contributionPoints: faker.number.int({ min: 500, max: 1000 }),
        socials: {
            twitter: `https://twitter.com/alexj`,
            linkedin: `https://linkedin.com/in/alexj`,
            website: faker.internet.url(),
        }
    },
    {
        id: STUDENT_USER_ID,
        name: 'Priya Sharma',
        email: 'student@123',
        role: 'student',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
        banner: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=300&fit=crop',
        bio: 'Aspiring full-stack developer and design enthusiast. Passionate about building beautiful and functional web applications.',
        usn: `1DA21CS123`,
        branch: 'Computer Science',
        contributionPoints: faker.number.int({ min: 50, max: 1000 }),
        achievements: [allAchievements[0], allAchievements[1]],
        interests: ['Technical', 'Arts', 'Design'],
        certifications: [{id: 'cert-1', name: 'React Basics', issuer: 'Meta', date: '2023-05-20'}],
    },
    {
        id: 'admin-user',
        name: 'Admin User',
        email: 'admin@school.edu',
        role: 'admin',
        password: 'password123',
        avatar: faker.image.avatar(),
        contributionPoints: 0,
    },
];

const dynamicStudents: User[] = Array.from({ length: 15 }, () => {
  const contributionPoints = faker.number.int({ min: 50, max: 1000 });
  const achievements = [];
  if (contributionPoints > 100) achievements.push(allAchievements[0]);
  if (contributionPoints > 250) achievements.push(allAchievements[1]);
  if (contributionPoints > 750) achievements.push(allAchievements[2]);

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'student',
    password: 'password123',
    avatar: faker.image.avatar(),
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=300&fit=crop',
    bio: faker.lorem.sentence(),
    usn: `1DA${faker.number.int({min: 20, max: 23})}${faker.helpers.arrayElement(['CS', 'IS', 'EC', 'ME'])}${faker.number.int({min: 100, max: 199})}`,
    branch: faker.helpers.arrayElement(['Computer Science', 'Information Science', 'Electronics', 'Mechanical']),
    contact: faker.phone.number(),
    interests: faker.helpers.arrayElements(['Technical', 'Arts', 'Public Speaking', 'Photography', 'Community Service'], {min: 2, max: 4}),
    certifications: Array.from({length: faker.number.int({min: 0, max: 2})}, () => ({
      id: faker.string.uuid(),
      name: `Certified ${faker.company.buzzNoun()} Professional`,
      issuer: faker.company.name(),
      date: faker.date.past({years: 2}).toLocaleDateString(),
    })),
    contributionPoints,
    achievements,
  }
});

export const mockUsers: User[] = [...staticUsers, ...dynamicStudents];

export const mockClubs: Club[] = clubNames.map((name, index) => {
  // Assign the first two clubs to the main leader account, the rest to the showcase leaders
  const leader = index < 2 ? mainLeader : requestedLeaders[index - 2];
  return {
    id: faker.string.uuid(),
    name,
    description: getClubDescription(name),
    category: getClubCategory(name),
    contactEmail: faker.internet.email({ firstName: name.split(' ')[0].toLowerCase(), provider: 'drait.edu' }),
    leaderId: leader.id,
    leaderName: leader.name,
    leaderAvatar: leader.avatar,
    memberCount: faker.number.int({ min: 25, max: 150 }),
    meetingSchedule: `${faker.date.weekday()}s at ${faker.number.int({ min: 4, max: 7 })}:30 PM`,
    location: `Room ${faker.number.int({ min: 101, max: 404 })} / Open Grounds`,
    isRecruiting: faker.datatype.boolean(0.8),
    tags: getClubTags(name),
    createdAt: faker.date.past().toISOString(),
    image: clubImages[index % clubImages.length],
    bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=300&fit=crop',
    welcomeMessage: `Welcome to ${name}! We're excited to have you. Check out our upcoming events.`,
    socials: {
      twitter: `https://twitter.com/${name.replace(/[^a-zA-Z0-9]/g, '')}`,
      linkedin: `https://linkedin.com/company/${name.replace(/[^a-zA-Z0-9]/g, '')}`,
      website: faker.internet.url(),
    },
    logoUrl: faker.image.avatar(),
    activityScore: faker.number.int({ min: 100, max: 5000 }),
  };
});

export const mockClubMembers: ClubMember[] = Array.from({ length: 50 }, (_, index) => {
  const user = faker.helpers.arrayElement(mockUsers.filter(u => u.role === 'student'));
  const status = index < 5 ? 'pending' : faker.helpers.arrayElement(['active', 'inactive']);
  return {
    id: faker.string.uuid(),
    clubId: faker.helpers.arrayElement(mockClubs).id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    status,
    joinedAt: faker.date.past().toISOString()
  };
});

export const mockAnnouncements: Announcement[] = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  createdAt: faker.date.recent().toISOString(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'])
}));

export const mockMeetingSchedules: MeetingSchedule[] = Array.from({ length: 20 }, (_, i) => {
  const club = faker.helpers.arrayElement(mockClubs);
  const eventType = faker.helpers.arrayElement(['meeting', 'event', 'workshop', 'audition', 'performance', 'talk'] as const);
  const isAuditoriumEvent = i % 2 === 0;

  return {
    id: faker.string.uuid(),
    clubId: club.id,
    title: `${club.name} ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`,
    description: faker.lorem.paragraph(),
    date: faker.date.future({ days: 30 }).toISOString().split('T')[0],
    time: `${faker.number.int({ min: 9, max: 18 })}:${faker.helpers.arrayElement(['00', '30'])}`,
    location: isAuditoriumEvent ? 'College Auditorium' : `Room ${faker.number.int({ min: 100, max: 999 })}`,
    type: eventType,
    hostingClub: club.name,
    auditionInfo: eventType === 'audition' ? `Sign-ups open until ${faker.date.soon({days: 2}).toLocaleDateString()}. Bring your own gear.` : undefined,
    ticketUrl: (eventType === 'performance' || eventType === 'event') ? 'https://example.com/tickets' : undefined,
  };
});

export const mockNotifications: Notification[] = [
    { id: faker.string.uuid(), content: 'Your request to join "The Coding Crew" has been approved.', createdAt: faker.date.recent({ days: 1 }).toISOString(), read: false },
    { id: faker.string.uuid(), content: 'New announcement from "Rhythm & Moves Dance Troupe": Auditions next week!', createdAt: faker.date.recent({ days: 2 }).toISOString(), read: false },
    { id: faker.string.uuid(), content: 'Reminder: "Yoga & Wellness Circle" has a session today at 5 PM.', createdAt: faker.date.recent({ days: 3 }).toISOString(), read: true },
    { id: faker.string.uuid(), content: 'Welcome to Dr. AIT ClubHubs! Explore and find your passion.', createdAt: faker.date.past({ years: 1 }).toISOString(), read: true },
];

export const mockGalleryImages: GalleryImage[] = Array.from({ length: 12 }, () => ({
    id: faker.string.uuid(),
    src: faker.image.urlLoremFlickr({ category: 'event', width: 600, height: 400 }),
    caption: faker.lorem.sentence({min: 5, max: 15}),
    uploadedAt: faker.date.recent().toISOString()
}));

export const mockTestimonials: Testimonial[] = [
    { id: 't-1', name: 'Ajay', role: 'Head, Fashion Club', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face', quote: 'ClubHubs helped us organize our annual fashion show flawlessly. Everything was on track.' },
    { id: 't-2', name: 'Riya', role: 'Lead, Dance Club', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face', quote: 'The meeting scheduler is a lifesaver! It helps us book practice halls and inform members instantly.' },
    { id: 't-3', name: 'Rohan', role: 'Lead, Music Club', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', quote: "We used announcements to promote our 'Battle of the Bands' event. The reach was amazing!" }
];

export const mockImpactStats: ImpactStat[] = [
    { id: 'stat-1', label: 'Clubs', value: 40, icon: 'Trophy' },
    { id: 'stat-2', label: 'Active Members', value: 5000, icon: 'Users' },
    { id: 'stat-3', label: 'Annual Events', value: 100, icon: 'Sparkles' },
    { id: 'stat-4', label: 'Student Engagement', value: 95, icon: 'Heart' },
];
