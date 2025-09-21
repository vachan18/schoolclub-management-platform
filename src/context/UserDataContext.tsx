import React, { createContext, useContext, ReactNode } from 'react';
import { Club, User, ClubMember, Announcement, MeetingSchedule } from '../types';
import { mockClubs, mockUsers, mockClubMembers, mockAnnouncements, mockMeetingSchedules } from '../data/mockData';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
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
      console.error(error);
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
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', mockUsers);
  const [clubs, setClubs] = useLocalStorage<Club[]>('clubs', mockClubs);
  const [clubMembers, setClubMembers] = useLocalStorage<ClubMember[]>('clubMembers', mockClubMembers);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', mockAnnouncements);
  const [meetings, setMeetings] = useLocalStorage<MeetingSchedule[]>('meetings', mockMeetingSchedules);

  return (
    <UserDataContext.Provider value={{ users, setUsers, clubs, setClubs, clubMembers, setClubMembers, announcements, setAnnouncements, meetings, setMeetings }}>
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
