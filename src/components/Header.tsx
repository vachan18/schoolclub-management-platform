import React, { useState, useEffect, useRef } from 'react';
import { User, Search, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationPanel from './NotificationPanel';
import { useAppData } from '../context/AppDataContext';
import { useSoundEffect } from '../hooks/useSoundEffect';
import { useNotificationSound } from '../hooks/useNotificationSound';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  userRole?: 'student' | 'leader' | 'admin';
  userName?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, userName, onMenuClick }) => {
  const { siteLogo, notifications, setNotifications } = useAppData();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const playLogoSound = useSoundEffect();
  const playNotificationSound = useNotificationSound();

  const unreadCount = notifications.filter(n => !n.read).length;
  const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      playNotificationSound();
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount, playNotificationSound]);


  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-foreground/80 dark:bg-foreground/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <motion.div
              onTap={playLogoSound}
              whileTap={{ scale: 1.1, rotateY: 360 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{ perspective: '1000px' }}
            >
              <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
                {siteLogo && <img src={siteLogo} alt="Site Logo" className="h-12 w-12 object-contain" />}
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dr. AIT ClubHubs</h1>
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 input-style"
                placeholder="Search clubs..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsPanelOpen(prev => !prev)}
                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>
              <NotificationPanel 
                isOpen={isPanelOpen}
                notifications={notifications}
                onClose={() => setIsPanelOpen(false)}
                onMarkAllRead={handleMarkAllRead}
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userName || 'Guest'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole || 'Visitor'}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
