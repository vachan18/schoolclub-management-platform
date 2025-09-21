import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Header from './Header';
import { mockGalleryImages } from '../data/mockData';
import { GalleryImage } from '../types';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(mockGalleryImages);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: GalleryImage[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      src: URL.createObjectURL(file),
      caption: 'Newly uploaded image',
      uploadedAt: new Date().toISOString(),
    }));
    setImages(prevImages => [...newImages, ...prevImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
  });

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

        <motion.div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed rounded-xl cursor-pointer text-center mb-12 transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isDragActive ? 'Drop the files here ...' : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImg(image.src)}
              >
                <img src={image.src} alt={image.caption} className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-300 cursor-pointer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{image.caption}</p>
                  <p className="text-xs text-gray-300">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.img
              src={selectedImg}
              alt="Enlarged view"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              layoutId={selectedImg}
            />
            <motion.button
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <X />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryPage;
