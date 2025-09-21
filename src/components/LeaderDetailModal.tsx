import React from 'react';
import { X, Phone, Twitter, Linkedin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Club } from '../types';

interface LeaderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderData: { user: User; club: Club } | null;
}

const LeaderDetailModal: React.FC<LeaderDetailModalProps> = ({ isOpen, onClose, leaderData }) => {
  if (!leaderData) return null;
  const { user, club } = leaderData;

  const socialLinks = [
    { href: user.socials?.website, icon: Globe, label: 'Website' },
    { href: user.socials?.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: user.socials?.twitter, icon: Twitter, label: 'Twitter' },
  ].filter(link => link.href);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
                <div className="h-24 bg-gradient-to-r from-primary to-secondary"></div>
                <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full object-cover absolute top-10 left-1/2 -translate-x-1/2 border-4 border-white dark:border-gray-800 shadow-lg"/>
            </div>
            <div className="pt-20 p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Leader of <span className="font-semibold text-primary">{club.name}</span></p>
                
                {user.contact && (
                    <div className="mt-6 flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                        <Phone className="h-5 w-5"/>
                        <a href={`tel:${user.contact}`} className="hover:underline">{user.contact}</a>
                    </div>
                )}

                {socialLinks.length > 0 && (
                    <div className="mt-4 flex items-center justify-center space-x-6">
                        {socialLinks.map(({ href, icon: Icon, label }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label} className="text-gray-500 hover:text-primary transition-colors">
                                <Icon className="h-6 w-6"/>
                            </a>
                        ))}
                    </div>
                )}
            </div>
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderDetailModal;
