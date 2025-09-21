import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import { Club, User } from '../types';

const Leaderboards: React.FC = () => {
    const { clubs, users } = useUserData();
    const topClubs = [...clubs].sort((a, b) => b.activityScore - a.activityScore).slice(0, 5);
    const topStudents = [...users].filter(u => u.role === 'student').sort((a, b) => b.contributionPoints - a.contributionPoints).slice(0, 5);

    const getTrophyColor = (index: number) => {
        if (index === 0) return 'text-yellow-400';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-yellow-600';
        return 'text-gray-500';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="py-8"
        >
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Campus Leaderboards</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Recognizing the most active clubs and contributors.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Award className="h-7 w-7 text-blue-500 mr-3" />
                        Most Active Clubs
                    </h2>
                    <ul className="space-y-4">
                        {topClubs.map((club, index) => (
                            <motion.li
                                key={club.id}
                                custom={index}
                                variants={itemVariants}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                                <div className="flex items-center">
                                    <Trophy className={`h-6 w-6 mr-4 ${getTrophyColor(index)}`} />
                                    <img src={club.image} alt={club.name} className="h-10 w-10 rounded-full object-cover mr-4"/>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{club.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{club.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-green-500 font-bold">
                                    <Star className="h-4 w-4 mr-1 fill-current" />
                                    {club.activityScore.toLocaleString()}
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Award className="h-7 w-7 text-purple-500 mr-3" />
                        Top Student Contributors
                    </h2>
                     <ul className="space-y-4">
                        {topStudents.map((student, index) => (
                            <motion.li
                                key={student.id}
                                custom={index}
                                variants={itemVariants}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                                <div className="flex items-center">
                                    <Trophy className={`h-6 w-6 mr-4 ${getTrophyColor(index)}`} />
                                    <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full object-cover mr-4"/>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{student.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.branch}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-yellow-500 font-bold">
                                    <Star className="h-4 w-4 mr-1 fill-current" />
                                    {student.contributionPoints.toLocaleString()}
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Leaderboards;
