import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Club, User, ClubMember, Announcement, MeetingSchedule } from '../types';
import { mockClubs, mockUsers, mockClubMembers, mockAnnouncements, mockMeetingSchedules } from '../data/mockData';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn(`LocalStorage quota exceeded for key "${key}". Data will not be persisted for this session. Please connect a backend for permanent storage.`);
      } else {
        console.error(error);
      }
    }
  };

  return [storedValue, setValue];
};

interface UserDataContextType {
  users: User[];
  setUsers: (users: User[] | ((val: User[]) => User[])) => void;
  clubs: Club[];
  setClubs: (clubs: Club[] | ((val: Club[]) => Club[])) => void;
  clubMembers: ClubMember[];
  setClubMembers: (members: ClubMember[] | ((val: ClubMember[]) => ClubMember[])) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[] | ((val: Announcement[]) => Announcement[])) => void;
  meetings: MeetingSchedule[];
  setMeetings: (meetings: MeetingSchedule[] | ((val: MeetingSchedule[]) => MeetingSchedule[])) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [clubs, setClubs] = useLocalStorage<Club[]>('clubs', []);
  const [clubMembers, setClubMembers] = useLocalStorage<ClubMember[]>('clubMembers', []);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', []);
  const [meetings, setMeetings] = useLocalStorage<MeetingSchedule[]>('meetings', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // This effect runs once on mount to seed data only if localStorage is empty.
    // This is non-destructive and preserves user edits.
    const isSeeded = localStorage.getItem('isUserDataSeeded_v2');
    if (!isSeeded) {
      const areUsersEmpty = JSON.parse(localStorage.getItem('users') || '[]').length === 0;
      if (areUsersEmpty) {
        setUsers(mockUsers);
        setClubs(mockClubs);
        setClubMembers(mockClubMembers);
        setAnnouncements(mockAnnouncements);
        setMeetings(mockMeetingSchedules);
        console.log("User data seeded into localStorage because it was empty.");
      }
      localStorage.setItem('isUserDataSeeded_v2', 'true');
    }
  }, []); // Empty dependency array ensures it runs only once.


  useEffect(() => {
    const userId = sessionStorage.getItem('currentUserId');
    if (userId && users.length > 0) {
        const user = users.find(u => u.id === userId);
        if (user) setCurrentUser(user);
    }
  }, [users]);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
        sessionStorage.setItem('currentUserId', user.id);
    } else {
        sessionStorage.removeItem('currentUserId');
        sessionStorage.removeItem('studentIsAuthenticated');
        sessionStorage.removeItem('leaderIsAuthenticated');
        sessionStorage.removeItem('adminIsAuthenticated');
    }
  };

  return (
    <UserDataContext.Provider value={{ users, setUsers, clubs, setClubs, clubMembers, setClubMembers, announcements, setAnnouncements, meetings, setMeetings, currentUser, setCurrentUser: handleSetCurrentUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
