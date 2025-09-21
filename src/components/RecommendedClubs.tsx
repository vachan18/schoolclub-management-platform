import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import ClubCard from './ClubCard';
import { Club } from '../types';

const RecommendedClubs: React.FC = () => {
    const { clubs, users } = useUserData();
    const studentUser = users.find(u => u.role === 'student');
    const studentInterests = studentUser?.interests || [];

    const recommendedClubs = clubs
        .filter(club => studentInterests.includes(club.category))
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, 3);
    
    if (recommendedClubs.length === 0) {
        return null; // Don't show the section if no recommendations
    }

    const handleJoinClub = (clubId: string) => {
        const club = clubs.find(c => c.id === clubId);
        alert(`Join request sent for ${club?.name}!`);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="mb-12"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Sparkles className="h-6 w-6 text-yellow-400 mr-3" />
                Recommended For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedClubs.map((club: Club, index: number) => (
                    <motion.div 
                        key={club.id} 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.1 + 0.3 }}
                    >
                        <ClubCard club={club} onJoinClick={handleJoinClub} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RecommendedClubs;
