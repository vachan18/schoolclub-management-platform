import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Ticket, Calendar, Clock, MapPin, Users, Mic } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { MeetingSchedule } from '../types';

const eventCategories = ['all', 'audition', 'performance', 'talk', 'workshop', 'event'];

const UpcomingEvents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { events, setNotifications } = useAppData();
    const { showToast } = useToast();

    const upcomingEvents = useMemo(() => {
        return events
            .filter(event => new Date(event.date) >= new Date() && event.location === 'College Auditorium')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events]);

    const filteredEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory;
            const matchesSearch = searchTerm === '' ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.hostingClub.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [upcomingEvents, selectedCategory, searchTerm]);

    const handleBookTicket = (event: MeetingSchedule) => {
        showToast(`Ticket successfully booked for "${event.title}"!`, 'success');
        setNotifications(prev => [{
            id: crypto.randomUUID(),
            content: `You have a ticket for ${event.title} on ${new Date(event.date).toLocaleDateString()}.`,
            createdAt: new Date().toISOString(),
            read: false
        }, ...prev]);
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
        <section id="events" className="py-20 bg-gray-50 dark:bg-background/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Happening at the Auditorium</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Check out the upcoming events and performances.</p>
                </motion.div>

                <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by event or club name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 input-style"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {eventCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="space-y-6"
                >
                    <AnimatePresence>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => <EventCard key={event.id} event={event} onBookTicket={handleBookTicket} />)
                        ) : (
                            <motion.div variants={itemVariants} className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No upcoming events match your criteria.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

const EventCard: React.FC<{ event: MeetingSchedule; onBookTicket: (event: MeetingSchedule) => void; }> = ({ event, onBookTicket }) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
            layout
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700 flex flex-col md:flex-row"
        >
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">{event.type}</span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{event.title}</h3>
                    </div>
                    {event.ticketUrl && (
                        <button onClick={() => onBookTicket(event)} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            <Ticket className="h-4 w-4" />
                            <span>Book Ticket</span>
                        </button>
                    )}
                </div>
                <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-3"><Users className="h-5 w-5 text-secondary" /><span className="font-medium">{event.hostingClub}</span></div>
                    <div className="flex items-center space-x-3"><Calendar className="h-5 w-5 text-secondary" /><span>{formattedDate}</span></div>
                    <div className="flex items-center space-x-3"><Clock className="h-5 w-5 text-secondary" /><span>{event.time}</span></div>
                    <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-secondary" /><span>{event.location}</span></div>
                    {event.auditionInfo && (
                        <div className="flex items-start space-x-3 pt-2 border-t dark:border-gray-700 mt-3">
                            <Mic className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">Audition Info</p>
                                <p>{event.auditionInfo}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UpcomingEvents;
