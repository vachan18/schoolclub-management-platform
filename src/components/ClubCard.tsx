import React from 'react';
import { Users, Calendar, MapPin, Mail, Tag, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Club } from '../types';

interface ClubCardProps {
  club: Club;
  onJoinClick?: (clubId: string) => void;
  showActions?: boolean;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, onJoinClick, showActions = true }) => {
  const categoryColors: { [key: string]: string } = {
    'Technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Sports': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Cultural': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
    'Community Service': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Special Interest': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm shadow-lg ${club.isRecruiting ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
          {club.isRecruiting ? '🔥 Recruiting' : '🔒 Closed'}
        </div>
        <div className={`absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold rounded-full ${categoryColors[club.category] || categoryColors['Special Interest']}`}>
          {club.category}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{club.memberCount}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {club.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{club.description}</p>
        <div className="space-y-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-3 text-blue-500" /><span>{club.meetingSchedule}</span></div>
          <div className="flex items-center"><MapPin className="h-4 w-4 mr-3 text-red-500" /><span>{club.location}</span></div>
        </div>
        
        {showActions && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <motion.button
              onClick={() => onJoinClick?.(club.id)}
              disabled={!club.isRecruiting}
              className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                club.isRecruiting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{club.isRecruiting ? 'Request to Join' : 'Not Recruiting'}</span>
              {club.isRecruiting && <ArrowRight className="h-4 w-4" />}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClubCard;
