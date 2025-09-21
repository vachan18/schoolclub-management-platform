import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClubMember } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: ClubMember) => void;
  memberToEdit?: ClubMember | null;
}

const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, onSave, memberToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'pending' | 'inactive'>('pending');

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.userName);
      setEmail(memberToEdit.userEmail);
      setStatus(memberToEdit.status);
    } else {
      setName(''); setEmail(''); setStatus('pending');
    }
  }, [memberToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onSave({
      id: memberToEdit?.id || crypto.randomUUID(),
      clubId: memberToEdit?.clubId || '',
      userId: memberToEdit?.userId || crypto.randomUUID(),
      joinedAt: memberToEdit?.joinedAt || new Date().toISOString(),
      userName: name,
      userEmail: email,
      status,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{memberToEdit ? 'Edit Member' : 'Add New Member'}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 px-3 py-2 input-style"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 px-3 py-2 input-style"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 px-3 py-2 input-style">
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{memberToEdit ? 'Save Changes' : 'Add Member'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberModal;
