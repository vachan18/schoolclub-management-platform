import React, { useState, useEffect } from 'react';
import { X, Save, Phone, Twitter, Linkedin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formState, setFormState] = useState<User | null>(user);

  useEffect(() => {
    setFormState(user);
  }, [user]);

  if (!formState) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => prev ? { ...prev, socials: { ...prev.socials, [name]: value } } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState) {
      onSave(formState);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Leader: {user.name}</h2>
                <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <input type="tel" name="contact" value={formState.contact || ''} onChange={handleChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Contact Number" />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <input type="url" name="website" value={formState.socials?.website || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Website URL" />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <input type="url" name="twitter" value={formState.socials?.twitter || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Twitter Profile URL" />
                </div>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <input type="url" name="linkedin" value={formState.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="LinkedIn Profile URL" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-4 border-t dark:border-gray-700">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2">
                  <Save className="h-4 w-4" /><span>Save Details</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserEditModal;
