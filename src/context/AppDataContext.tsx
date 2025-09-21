import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Testimonial, ImpactStat, MeetingSchedule } from '../types';
import { mockTestimonials, mockImpactStats, mockMeetingSchedules } from '../data/mockData';

interface AppDataContextType {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[] | ((val: Testimonial[]) => Testimonial[])) => void;
  impactStats: ImpactStat[];
  setImpactStats: (stats: ImpactStat[] | ((val: ImpactStat[]) => ImpactStat[])) => void;
  events: MeetingSchedule[];
  setEvents: (events: MeetingSchedule[] | ((val: MeetingSchedule[]) => MeetingSchedule[])) => void;
  siteLogo: string | null;
  setSiteLogo: (logo: string | null | ((val: string | null) => string | null)) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

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
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const defaultLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSI4Ij48cGF0aCBkPSJNIDIwIDIwIEwgODAgMjAgTCA4MCA4MCBMIDIwIDgwIFoiIHN0cm9rZT0iIzNCODJGNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBzdHJva2U9IiM4QjVDRjYiLz48L2c+PC9zdmc+';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>('testimonials', mockTestimonials);
  const [impactStats, setImpactStats] = useLocalStorage<ImpactStat[]>('impactStats', mockImpactStats);
  const [events, setEvents] = useLocalStorage<MeetingSchedule[]>('events', mockMeetingSchedules);
  const [siteLogo, setSiteLogo] = useLocalStorage<string | null>('siteLogo', defaultLogo);

  useEffect(() => {
    if (events && events.length > 0) {
      const latestEventDate = events.reduce((latest, current) => {
        const currentDate = new Date(current.date);
        return currentDate > latest ? currentDate : latest;
      }, new Date(0));

      if (latestEventDate < new Date()) {
        const refreshedEvents = events.map(event => ({
          ...event,
          date: faker.date.future({ days: 30 }).toISOString().split('T')[0],
        }));
        setEvents(refreshedEvents);
      }
    }
  }, []);

  return (
    <AppDataContext.Provider value={{ testimonials, setTestimonials, impactStats, setImpactStats, events, setEvents, siteLogo, setSiteLogo }}>
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
