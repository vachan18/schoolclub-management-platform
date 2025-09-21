import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryImage } from '../types';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage | null;
  onSave: (image: GalleryImage) => void;
  onDelete: (id: string) => void;
}

const ImageEditModal: React.FC<ImageEditModalProps> = ({ isOpen, onClose, image, onSave, onDelete }) => {
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (image) {
      setCaption(image.caption);
      setDate(new Date(image.uploadedAt).toISOString().split('T')[0]);
    }
  }, [image]);

  if (!image) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...image,
      caption,
      uploadedAt: new Date(date).toISOString(),
    });
  };

  const handleDelete = () => {
    if (image) {
        onDelete(image.id);
    }
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Image Details</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <img src={image.src} alt={image.caption} className="w-full h-64 object-cover rounded-md mb-4" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption / Event Info</label>
                  <textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} required rows={3} className="mt-1 px-3 py-2 input-style"/>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Event/Upload</label>
                  <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 px-3 py-2 input-style"/>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                  <div className="flex space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Details</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageEditModal;
