import React from 'react';
import { Users, Calendar, MapPin, Mail, Tag, Star, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Club } from '../types';

interface ClubCardProps {
  club: Club;
  onJoinClick?: (clubId: string) => void;
  showActions?: boolean;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, onJoinClick, showActions = true }) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technical': 'bg-blue-100 text-blue-800',
      'Sports': 'bg-green-100 text-green-800',
      'Arts': 'bg-purple-100 text-purple-800',
      'Cultural': 'bg-pink-100 text-pink-800',
      'Professional Development': 'bg-indigo-100 text-indigo-800',
      'Community Service': 'bg-orange-100 text-orange-800',
      'Innovation': 'bg-yellow-100 text-yellow-800',
      'Special Interest': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
              club.isRecruiting 
                ? 'bg-green-500/90 text-white shadow-lg' 
                : 'bg-gray-500/90 text-white shadow-lg'
            }`}
          >
            {club.isRecruiting ? '🔥 Recruiting' : '🔒 Closed'}
          </motion.span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${getCategoryColor(club.category)}`}>
            {club.category}
          </span>
        </div>

        {/* Member Count Overlay */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{club.memberCount}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {club.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{club.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-3 text-blue-500" />
            <span>{club.meetingSchedule}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-3 text-red-500" />
            <span>{club.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-3 text-green-500" />
            <span className="truncate">{club.contactEmail}</span>
          </div>
        </div>

        {club.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {club.tags.slice(0, 3).map((tag, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </motion.span>
            ))}
            {club.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{club.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onJoinClick?.(club.id)}
              disabled={!club.isRecruiting}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                club.isRecruiting
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{club.isRecruiting ? 'Request to Join' : 'Not Recruiting'}</span>
              {club.isRecruiting && <ArrowRight className="h-4 w-4" />}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2.5 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>Details</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        )}

        {/* Leader Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{club.leaderName.charAt(0)}</span>
            </div>
            <span className="text-xs text-gray-600">Led by {club.leaderName}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubCard;
