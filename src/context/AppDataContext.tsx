import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Testimonial, ImpactStat, MeetingSchedule, GalleryImage, Notification } from '../types';
import { mockTestimonials, mockImpactStats, mockMeetingSchedules, mockGalleryImages, mockNotifications } from '../data/mockData';

interface AppDataContextType {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[] | ((val: Testimonial[]) => Testimonial[])) => void;
  impactStats: ImpactStat[];
  setImpactStats: (stats: ImpactStat[] | ((val: ImpactStat[]) => ImpactStat[])) => void;
  events: MeetingSchedule[];
  setEvents: (events: MeetingSchedule[] | ((val: MeetingSchedule[]) => MeetingSchedule[])) => void;
  siteLogo: string | null;
  setSiteLogo: (logo: string | null | ((val: string | null) => string | null)) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[] | ((val: GalleryImage[]) => GalleryImage[])) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[] | ((val: Notification[]) => Notification[])) => void;
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
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn(`LocalStorage quota exceeded for key "${key}". Data will not be persisted for this session. Please connect a backend for permanent storage.`);
      } else {
        console.error(error);
      }
    }
  };

  return [storedValue, setValue];
};

const defaultLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSI4Ij48cGF0aCBkPSJNIDIwIDIwIEwgODAgMjAgTCA4MCA4MCBMIDIwIDgwIFoiIHN0cm9rZT0iIzNCODJGNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBzdHJva2U9IiM4QjVDRjYiLz48L2c+PC9zdmc+';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>('testimonials', []);
  const [impactStats, setImpactStats] = useLocalStorage<ImpactStat[]>('impactStats', []);
  const [events, setEvents] = useLocalStorage<MeetingSchedule[]>('events', []);
  const [siteLogo, setSiteLogo] = useLocalStorage<string | null>('siteLogo', defaultLogo);
  const [galleryImages, setGalleryImages] = useLocalStorage<GalleryImage[]>('galleryImages', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

  useEffect(() => {
    const isSeeded = localStorage.getItem('isAppDataSeeded_v2');
    if (!isSeeded) {
      const areTestimonialsEmpty = JSON.parse(localStorage.getItem('testimonials') || '[]').length === 0;
      const areGalleryImagesEmpty = JSON.parse(localStorage.getItem('galleryImages') || '[]').length === 0;

      if (areTestimonialsEmpty) setTestimonials(mockTestimonials);
      if (areGalleryImagesEmpty) setGalleryImages(mockGalleryImages);
      
      // Seed other data only if it's not present
      if (!localStorage.getItem('impactStats')) setImpactStats(mockImpactStats);
      if (!localStorage.getItem('events')) setEvents(mockMeetingSchedules);
      if (!localStorage.getItem('notifications')) setNotifications(mockNotifications);

      console.log("App data seeded if empty.");
      localStorage.setItem('isAppDataSeeded_v2', 'true');
    }
  }, []);

  return (
    <AppDataContext.Provider value={{ testimonials, setTestimonials, impactStats, setImpactStats, events, setEvents, siteLogo, setSiteLogo, galleryImages, setGalleryImages, notifications, setNotifications }}>
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
