import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import { useAppData } from '../context/AppDataContext';

const GalleryPage: React.FC = () => {
  const { galleryImages } = useAppData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Campus Moments</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">A snapshot of student life and club events at Dr. AIT.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {galleryImages.slice(0, 10).map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <img src={image.src} alt={image.caption} className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{image.caption}</p>
                  <p className="text-xs text-gray-300">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {galleryImages.length === 0 && (
            <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400">The gallery is currently empty. Check back soon for photos from campus events!</p>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryPage;
