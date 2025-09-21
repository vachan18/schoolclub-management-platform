import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, PlusCircle, User, Compass, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import ClubCard from './ClubCard';
import Header from './Header';
import RequestClubModal from './RequestClubModal';
import StudentProfile from './StudentProfile';
import RecommendedClubs from './RecommendedClubs';
import Leaderboards from './Leaderboards';
import OnboardingModal from './OnboardingModal';
import { ClubMember } from '../types';

const categories = ['All', 'Technical', 'Cultural', 'Arts', 'Community Service', 'Special Interest', 'Sports'];

const ClubExplorer: React.FC = () => {
    const { clubs, users, clubMembers, setClubMembers } = useUserData();
    const { setNotifications } = useAppData();
    const { showToast } = useToast();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const studentUser = users.find(u => u.role === 'student');

    const filteredClubs = clubs
        .filter(club => {
            const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (club.tags && club.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
            const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

    const handleJoinClub = (clubId: string) => {
        const club = clubs.find(c => c.id === clubId);
        if (!club || !studentUser) return;

        const existingRequest = clubMembers.find(m => m.userId === studentUser.id && m.clubId === clubId);
        if (existingRequest) {
            showToast(`You have already sent a request to ${club.name}.`, "info");
            return;
        }

        const newRequest: ClubMember = {
            id: crypto.randomUUID(),
            clubId: clubId,
            userId: studentUser.id,
            userName: studentUser.name,
            userEmail: studentUser.email,
            status: 'pending',
            joinedAt: new Date().toISOString(),
        };

        setClubMembers(prev => [...prev, newRequest]);
        showToast(`Your request to join ${club.name} has been sent!`, 'success');
        
        // Notify the club leader (in a real app, this would be targeted)
        setNotifications(prev => [{
            id: crypto.randomUUID(),
            content: `${studentUser.name} has requested to join ${club.name}.`,
            createdAt: new Date().toISOString(),
            read: false
        }, ...prev]);
    };
    
    const handleRequestSubmit = (details: { name: string; category: string; description: string }) => {
        console.log('New club request:', details);
        showToast(`Your request for "${details.name}" has been submitted!`, 'success');
        setIsRequestModalOpen(false);
    };

    return (
        <div className="py-8">
            <RecommendedClubs />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" placeholder="Search by name, skill, or project..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 input-style transition-all"/>
                    </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={() => setIsRequestModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <PlusCircle className="h-5 w-5" />
                        <span className="hidden sm:inline">Request Club</span>
                    </button>
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Grid className="h-5 w-5" /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><List className="h-5 w-5" /></button>
                    </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <motion.button key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 text-sm rounded-full transition-all ${selectedCategory === category ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                        {category}
                        </motion.button>
                    ))}
                    </div>
                </div>
            </motion.div>

            <motion.div layout className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                <AnimatePresence>
                    {filteredClubs.map((club, index) => (
                    <motion.div key={club.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }}>
                        <ClubCard club={club} onJoinClick={handleJoinClub} />
                    </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            <RequestClubModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onRequestSubmit={handleRequestSubmit} />
        </div>
    );
}

const StudentDashboard: React.FC = () => {
    const { users } = useUserData();
    const studentUser = users.find(u => u.role === 'student');
    const [activeTab, setActiveTab] = useState<'profile' | 'explore' | 'leaderboards'>('profile');
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (!hasOnboarded) {
            setShowOnboarding(true);
        }
    }, []);

    const handleCloseOnboarding = () => {
        localStorage.setItem('hasOnboarded', 'true');
        setShowOnboarding(false);
    };

    if (!studentUser) {
        return <div>Loading student profile...</div>
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
        >
            <Header userRole="student" userName={studentUser.name} />
            <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'}`}
                        >
                            <User className="h-5 w-5" /> <span>My Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'explore' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'}`}
                        >
                            <Compass className="h-5 w-5" /> <span>Explore Clubs</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('leaderboards')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'leaderboards' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'}`}
                        >
                            <BarChart2 className="h-5 w-5" /> <span>Leaderboards</span>
                        </button>
                    </nav>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'profile' && <StudentProfile student={studentUser} />}
                        {activeTab === 'explore' && <ClubExplorer />}
                        {activeTab === 'leaderboards' && <Leaderboards />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
