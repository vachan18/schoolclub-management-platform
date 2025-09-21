import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RequestClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmit: (details: { name: string; category: string; description: string }) => void;
}

const categories = ['Technical', 'Cultural', 'Arts', 'Community Service', 'Special Interest', 'Sports'];

const RequestClubModal: React.FC<RequestClubModalProps> = ({ isOpen, onClose, onRequestSubmit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    onRequestSubmit({ name, category, description });
    setName('');
    setCategory(categories[0]);
    setDescription('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request to Form a New Club</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Have a great idea for a new club? Fill out the details below and we'll review your proposal.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proposed Club Name</label>
                  <input type="text" id="clubName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 px-3 py-2 input-style"/>
                </div>
                 <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 px-3 py-2 input-style">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mission & Description</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 px-3 py-2 input-style" placeholder="What is the main purpose and what activities will your club organize?"/>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestClubModal;
