import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Testimonial, ImpactStat, MeetingSchedule } from '../types';
import { mockTestimonials, mockImpactStats, mockMeetingSchedules } from '../data/mockData';

interface AppDataContextType {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  impactStats: ImpactStat[];
  setImpactStats: (stats: ImpactStat[]) => void;
  events: MeetingSchedule[];
  setEvents: (events: MeetingSchedule[]) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
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

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>('testimonials', mockTestimonials);
  const [impactStats, setImpactStats] = useLocalStorage<ImpactStat[]>('impactStats', mockImpactStats);
  const [events, setEvents] = useLocalStorage<MeetingSchedule[]>('events', mockMeetingSchedules);

  return (
    <AppDataContext.Provider value={{ testimonials, setTestimonials, impactStats, setImpactStats, events, setEvents }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
