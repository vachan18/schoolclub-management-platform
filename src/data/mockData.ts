import { faker } from '@faker-js/faker';
import { Club, User, ClubMember, Announcement, MeetingSchedule } from '../types';

const categories = [
  'Technical', 'Cultural', 'Sports', 'Professional Development', 'Community Service',
  'Innovation', 'Arts', 'Special Interest'
];

// Club names inspired by a technical institute
const clubNames = [
  'AI & Machine Learning Club', 'SAE BAJA Motorsports', 'Google Developer Student Club', 'Aeromodelling Club',
  'Civil Engineering Students Association', 'Robotics & Automation Society', 'Entrepreneurship Cell', 'Literary & Debating Society',
  'Photography Club', 'Music & Dramatics Club', 'Team Akshray Urja (Solar Car)', 'Ethical Hacking Club',
  'Astronomy Club', 'Finance & Investment Cell', 'Dance Club', 'Sports Committee',
  'Code Ninjas', 'Architecture & Design Group', 'NSS Unit', 'Renewable Energy Club'
];

// High-quality, relevant images for technical clubs
const clubImages = [
  'https://images.unsplash.com/photo-1593062638383-5973b8851c1d?w=400&h=300&fit=crop', // AI/ML, abstract tech
  'https://images.unsplash.com/photo-1567906623221-167e8c366e0f?w=400&h=300&fit=crop', // Motorsports, car engine
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', // Coding, web development
  'https://images.unsplash.com/photo-1507297235269-b3a6d1b73643?w=400&h=300&fit=crop', // Aeromodelling, drone
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', // Civil Engineering, construction
  'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=300&fit=crop', // Robotics
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', // E-Cell, business meeting
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', // Literary, writing
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop', // Photography
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop', // Music/Dramatics
  'https://images.unsplash.com/photo-1620371351233-13c95a528847?w=400&h=300&fit=crop', // Solar Car
  'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=400&h=300&fit=crop', // Ethical Hacking, cybersecurity
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop', // Astronomy, space
  'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop', // Finance, money
  'https://images.unsplash.com/photo-1524594152333-73f9d2d24783?w=400&h=300&fit=crop', // Dance
  'https://images.unsplash.com/photo-1575361204480-aadea2503aa4?w=400&h=300&fit=crop', // Sports, football
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=300&fit=crop', // Code Ninjas, abstract code
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop', // Architecture
  'https://images.unsplash.com/photo-1618479124430-943989a47b71?w=400&h=300&fit=crop', // NSS, community service
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop'  // Renewable Energy, wind turbines
];

// Generate mock clubs with better descriptions
export const mockClubs: Club[] = clubNames.map((name, index) => ({
  id: faker.string.uuid(),
  name,
  description: getClubDescription(name),
  category: getClubCategory(name),
  contactEmail: faker.internet.email({ firstName: name.split(' ')[0], provider: 'drait.edu' }),
  leaderId: faker.string.uuid(),
  leaderName: faker.person.fullName(),
  memberCount: faker.number.int({ min: 15, max: 250 }),
  meetingSchedule: `${faker.date.weekday()}s at ${faker.number.int({ min: 4, max: 7 })}:30 PM`,
  location: `Lab ${faker.number.int({ min: 1, max: 20 })} / LH-${faker.number.int({ min: 101, max: 404 })}`,
  isRecruiting: faker.datatype.boolean(0.7),
  tags: getClubTags(name),
  createdAt: faker.date.past().toISOString(),
  image: clubImages[index % clubImages.length]
}));

// Function to generate realistic club descriptions
function getClubDescription(clubName: string): string {
  const descriptions: { [key: string]: string } = {
    'AI & Machine Learning Club': 'Dive into the world of artificial intelligence. We host workshops on neural networks, data science competitions, and collaborative research projects.',
    'SAE BAJA Motorsports': 'Design, build, and race an off-road vehicle in the national SAE BAJA competition. A high-octane blend of mechanical engineering, teamwork, and passion.',
    'Google Developer Student Club': 'A community for students interested in Google developer technologies. Learn mobile and web development, cloud computing, and more through hands-on workshops.',
    'Aeromodelling Club': 'From drones to fixed-wing aircraft, we design, build, and fly our own creations. Join us to explore the principles of aerodynamics and aviation.',
    'Civil Engineering Students Association': 'Bridge the gap between theory and practice. We organize site visits, guest lectures from industry experts, and structural design competitions.',
    'Robotics & Automation Society': 'Explore the future of automation. Build and program robots for various challenges, from line-followers to complex automated systems.',
    'Entrepreneurship Cell': 'Ignite your startup idea! The E-Cell fosters innovation through workshops, mentorship from successful founders, and our annual flagship startup pitch event.',
    'Literary & Debating Society': 'Hone your public speaking and critical thinking skills. Participate in debates, discussions, and literary events on campus and beyond.',
    'Photography Club': 'Capture moments, tell stories. We conduct photo walks, workshops on advanced photography and editing techniques, and host annual exhibitions.',
    'Music & Dramatics Club': 'The heart of campus culture. From stage plays to musical nights, we provide a platform for actors, musicians, and backstage crew to shine.',
    'Team Akshray Urja (Solar Car)': 'Pioneering sustainable transportation by designing and building a solar-powered electric vehicle for national and international competitions.',
    'Ethical Hacking Club': 'Explore the world of cybersecurity. Learn about network security, penetration testing, and defensive strategies in a controlled, ethical environment.',
    'Astronomy Club': 'Discover the cosmos. We organize stargazing sessions with our telescope, discussions on astrophysics, and trips to observatories.',
    'Finance & Investment Cell': 'Navigate the world of finance. We analyze market trends, manage a mock portfolio, and host workshops on valuation and investment strategies.',
    'Dance Club': 'Express yourself through movement. Our club embraces all forms of dance, from classical to hip-hop, performing at cultural fests and competitions.',
    'Sports Committee': 'Promoting a healthy and active campus life by organizing inter-departmental tournaments, marathons, and other sporting events throughout the year.',
    'Code Ninjas': 'A competitive programming-focused group. We solve complex algorithmic problems on platforms like Codeforces and LeetCode to prepare for ICPC and other contests.',
    'Architecture & Design Group': 'For students passionate about design and the built environment. We work on real-world design problems, model making, and software workshops.',
    'NSS Unit': 'The National Service Scheme unit dedicated to community service, social welfare, and creating a positive impact through volunteer work.',
    'Renewable Energy Club': 'Focused on promoting and innovating in the field of sustainable energy. We work on projects related to solar, wind, and other green technologies.'
  };
  
  return descriptions[clubName] || faker.lorem.paragraph(3);
}

function getClubCategory(clubName: string): string {
    const technical = ['AI', 'SAE', 'Google', 'Aero', 'Civil', 'Robotics', 'Solar', 'Hacking', 'Code', 'Renewable'];
    if (technical.some(term => clubName.includes(term))) return 'Technical';
    if (clubName.includes('E-Cell') || clubName.includes('Finance')) return 'Professional Development';
    if (clubName.includes('Literary') || clubName.includes('Music') || clubName.includes('Dance') || clubName.includes('Photo')) return 'Cultural';
    if (clubName.includes('Sports')) return 'Sports';
    if (clubName.includes('NSS')) return 'Community Service';
    return 'Special Interest';
}

// Function to generate relevant tags for clubs
function getClubTags(clubName: string): string[] {
    const tagMap: { [key: string]: string[] } = {
        'AI & Machine Learning Club': ['AI/ML', 'Data Science', 'Python', 'Research'],
        'SAE BAJA Motorsports': ['Automobile', 'Mechanical', 'Competition', 'Design'],
        'Google Developer Student Club': ['Android', 'Web Dev', 'Cloud', 'Google Tech'],
        'Aeromodelling Club': ['Aeronautics', 'Drones', 'RC Planes', 'DIY'],
        'Civil Engineering Students Association': ['Structures', 'AutoCAD', 'Site Visits', 'Infra'],
        'Robotics & Automation Society': ['Robotics', 'Automation', 'Arduino', 'IoT'],
        'Entrepreneurship Cell': ['Startup', 'Business', 'Networking', 'Pitching'],
        'Literary & Debating Society': ['Debate', 'Public Speaking', 'Literature', 'MUN'],
        'Photography Club': ['DSLR', 'Editing', 'Photo Walk', 'Exhibition'],
        'Music & Dramatics Club': ['Theatre', 'Music', 'Performance', 'Cultural Fest'],
        'Team Akshray Urja (Solar Car)': ['Solar Power', 'EV', 'Sustainability', 'Engineering'],
        'Ethical Hacking Club': ['Cybersecurity', 'Infosec', 'CTF', 'Networking'],
        'Astronomy Club': ['Astrophysics', 'Telescope', 'Stargazing', 'Cosmos'],
        'Finance & Investment Cell': ['Stock Market', 'Investing', 'Valuation', 'Fintech'],
        'Dance Club': ['Choreography', 'Hip-Hop', 'Contemporary', 'Performance'],
        'Sports Committee': ['Athletics', 'Cricket', 'Football', 'Health'],
        'Code Ninjas': ['Competitive Programming', 'Algorithms', 'ICPC', 'Data Structures'],
        'Architecture & Design Group': ['Urban Design', 'CAD', 'Model Making', 'Sustainable Arch'],
        'NSS Unit': ['Social Work', 'Volunteering', 'Community', 'Awareness'],
        'Renewable Energy Club': ['Green Tech', 'Solar', 'Sustainability', 'Environment']
    };
  
  return tagMap[clubName] || faker.helpers.arrayElements(['engineering', 'student-run', 'workshops', 'projects'], { min: 2, max: 4 });
}

// Generate mock users
export const mockUsers: User[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['student', 'leader']),
  avatar: faker.image.avatar()
}));

// Generate mock club members
export const mockClubMembers: ClubMember[] = Array.from({ length: 100 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  userId: faker.helpers.arrayElement(mockUsers).id,
  userName: faker.person.fullName(),
  userEmail: faker.internet.email(),
  status: faker.helpers.arrayElement(['active', 'pending', 'inactive']),
  joinedAt: faker.date.past().toISOString()
}));

// Generate mock announcements
export const mockAnnouncements: Announcement[] = Array.from({ length: 30 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  createdAt: faker.date.recent().toISOString(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'])
}));

// Generate mock meeting schedules
export const mockMeetingSchedules: MeetingSchedule[] = Array.from({ length: 40 }, () => ({
  id: faker.string.uuid(),
  clubId: faker.helpers.arrayElement(mockClubs).id,
  title: faker.lorem.sentence({ min: 3, max: 6 }),
  description: faker.lorem.paragraph(),
  date: faker.date.future().toDateString(),
  time: `${faker.number.int({ min: 9, max: 18 })}:${faker.helpers.arrayElement(['00', '30'])}`,
  location: `Room ${faker.number.int({ min: 100, max: 999 })}`,
  type: faker.helpers.arrayElement(['meeting', 'event', 'workshop'])
}));
