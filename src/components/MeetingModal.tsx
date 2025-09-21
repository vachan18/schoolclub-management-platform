import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeetingSchedule } from '../types';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: MeetingSchedule) => void;
  meetingToEdit?: MeetingSchedule | null;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose, onSave, meetingToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'meeting' | 'event' | 'workshop'>('meeting');

  useEffect(() => {
    if (meetingToEdit) {
      setTitle(meetingToEdit.title);
      setDescription(meetingToEdit.description);
      setDate(new Date(meetingToEdit.date).toISOString().split('T')[0]);
      setTime(meetingToEdit.time);
      setLocation(meetingToEdit.location);
      setType(meetingToEdit.type);
    } else {
      setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setType('meeting');
    }
  }, [meetingToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    onSave({
      id: meetingToEdit?.id || crypto.randomUUID(),
      clubId: meetingToEdit?.clubId || '',
      title, description, date: new Date(date).toDateString(), time, location, type,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{meetingToEdit ? 'Edit Event' : 'Schedule New Event'}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 px-3 py-2 input-style" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 px-3 py-2 input-style" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 px-3 py-2 input-style" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 px-3 py-2 input-style" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 px-3 py-2 input-style">
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 px-3 py-2 input-style" />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{meetingToEdit ? 'Save Changes' : 'Schedule'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeetingModal;
