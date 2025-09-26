import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { User, Club } from '../types';
import LeaderDetailModal from './LeaderDetailModal';

const ClubLeadersShowcase: React.FC = () => {
    const { clubs, users } = useUserData();
    const [selectedLeader, setSelectedLeader] = useState<{ user: User, club: Club } | null>(null);

    const leaderNamesToShow = ['Chinmay', 'Sumant', 'Rahul', 'Nandana', 'Anita', 'Rosie'];
    
    // Filter clubs to only include those led by the specified leaders
    const showcasedClubs = clubs.filter(club => leaderNamesToShow.includes(club.leaderName));

    const handleLeaderClick = (club: Club) => {
        const leaderUser = users.find(u => u.id === club.leaderId);
        if (leaderUser) {
            setSelectedLeader({ user: leaderUser, club });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <section id="leaders" className="py-20 bg-foreground dark:bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet the Leaders</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">The dedicated students heading our vibrant clubs.</p>
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"
                >
                    {showcasedClubs.map(club => (
                        <motion.div 
                            key={club.id} 
                            variants={itemVariants}
                            className="text-center group cursor-pointer"
                            onClick={() => handleLeaderClick(club)}
                        >
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <img 
                                    src={club.leaderAvatar} 
                                    alt={club.leaderName} 
                                    className="w-full h-full rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary transition-all"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                                    <img src={club.logoUrl} alt={`${club.name} logo`} className="w-6 h-6 rounded-full object-contain" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">{club.leaderName}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{club.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <LeaderDetailModal 
                isOpen={!!selectedLeader} 
                onClose={() => setSelectedLeader(null)} 
                leaderData={selectedLeader}
            />
        </section>
    );
};

export default ClubLeadersShowcase;
