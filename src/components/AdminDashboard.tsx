import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, FileText, Trash2, Edit, Plus, Save, UploadCloud, Calendar, Users, Image as ImageIcon, Shield } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '../context/ThemeContext';
import { useAppData } from '../context/AppDataContext';
import { useUserData } from '../context/UserDataContext';
import { useToast } from '../context/ToastContext';
import Header from './Header';
import { Testimonial, ImpactStat, MeetingSchedule, Club, GalleryImage, User } from '../types';
import ImageEditModal from './ImageEditModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import UserEditModal from './UserEditModal';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('theme');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-background"
        >
            <Header userRole="admin" userName="Site Admin" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-foreground rounded-lg shadow-sm p-4 sticky top-28 border border-gray-200 dark:border-gray-700">
                            <nav className="space-y-1">
                                <button onClick={() => setActiveTab('theme')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'theme' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <Palette /><span>Theme Editor</span>
                                </button>
                                <button onClick={() => setActiveTab('content')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'content' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <FileText /><span>Content Manager</span>
                                </button>
                                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <Shield /><span>User Management</span>
                                </button>
                                <button onClick={() => setActiveTab('events')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'events' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <Calendar /><span>Events Manager</span>
                                </button>
                                <button onClick={() => setActiveTab('clubs')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'clubs' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <Users /><span>Club Manager</span>
                                </button>
                                <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${activeTab === 'gallery' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <ImageIcon /><span>Gallery Manager</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-foreground rounded-lg shadow-sm min-h-[600px] border border-gray-200 dark:border-gray-700">
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'theme' && <ThemeEditor />}
                                    {activeTab === 'content' && <ContentEditor />}
                                    {activeTab === 'users' && <UserManager />}
                                    {activeTab === 'events' && <EventsManager />}
                                    {activeTab === 'clubs' && <ClubManager />}
                                    {activeTab === 'gallery' && <GalleryManager />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
const ThemeEditor: React.FC = () => {
    const { themeSettings, setThemeSettings } = useTheme();
    const { showToast } = useToast();

    const handleColorChange = (mode: 'light' | 'dark', key: string, color: string) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const rgbString = `${r} ${g} ${b}`;
        setThemeSettings(prev => ({
            ...prev,
            [mode]: { ...prev[mode], [key]: rgbString }
        }));
    };
    
    const ColorInput = ({ mode, colorKey, label }: { mode: 'light' | 'dark', colorKey: keyof typeof themeSettings.light, label: string }) => {
        const [showPicker, setShowPicker] = useState(false);
        const rgbString = themeSettings[mode][colorKey];
        const color = `rgb(${rgbString})`;
        const toHex = (rgb: string) => {
            const [r, g, b] = rgb.split(' ').map(Number);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };
        const hexColor = toHex(rgbString);
        return (
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <div className="mt-1 flex items-center space-x-2">
                    <div 
                        className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => setShowPicker(!showPicker)}
                    />
                    <input type="text" value={hexColor} readOnly className="input-style"/>
                </div>
                {showPicker && (
                    <div className="absolute z-10 mt-2" onMouseLeave={() => setShowPicker(false)}>
                        <HexColorPicker color={hexColor} onChange={(newColor) => handleColorChange(mode, colorKey, newColor)} />
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Theme Editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium text-lg">Light Mode</h3>
                    <ColorInput mode="light" colorKey="primary" label="Primary Color" />
                    <ColorInput mode="light" colorKey="secondary" label="Secondary Color" />
                    <ColorInput mode="light" colorKey="background" label="Background Color" />
                    <ColorInput mode="light" colorKey="foreground" label="Foreground Color" />
                </div>
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium text-lg">Dark Mode</h3>
                    <ColorInput mode="dark" colorKey="primary" label="Primary Color" />
                    <ColorInput mode="dark" colorKey="secondary" label="Secondary Color" />
                    <ColorInput mode="dark" colorKey="background" label="Background Color" />
                    <ColorInput mode="dark" colorKey="foreground" label="Foreground Color" />
                </div>
            </div>
             <div className="mt-6 text-right">
                <button onClick={() => showToast("Theme settings saved permanently!")} className="px-6 py-2.5 bg-blue-600 text-white rounded-md flex items-center space-x-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <Save className="h-5 w-5" /><span>Save Theme</span>
                </button>
            </div>
        </div>
    );
};
const ContentEditor: React.FC = () => {
    return (
        <div className="p-6 space-y-8">
            <SiteBrandingManager />
            <ImpactStatsManager />
            <TestimonialsManager />
        </div>
    );
};
const SiteBrandingManager: React.FC = () => {
    const { siteLogo, setSiteLogo } = useAppData();
    const { showToast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setSiteLogo(reader.result as string);
                showToast("Logo updated. Click save to make it permanent.");
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, [setSiteLogo, showToast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.svg', '.gif'] },
        multiple: false,
    });
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Site Branding</h2>
            <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Logo</label>
                <div className="mt-2 flex items-center space-x-4">
                    {siteLogo ? (
                        <img src={siteLogo} alt="Site Logo" className="h-16 w-16 rounded-lg object-contain bg-gray-100 dark:bg-gray-700 p-1"/>
                    ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-500" />
                        </div>
                    )}
                    <div {...getRootProps()} className={`flex-grow p-4 border-2 border-dashed rounded-lg cursor-pointer text-center ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {isDragActive ? 'Drop the logo here' : 'Drag & drop or click to upload a new logo'}
                        </p>
                    </div>
                </div>
                 <div className="mt-4 text-right">
                    <button onClick={() => showToast("Branding saved permanently!")} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 text-sm">
                        <Save className="h-4 w-4" /><span>Save Branding</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
const ImpactStatsManager: React.FC = () => {
    const { impactStats, setImpactStats } = useAppData();
    const { showToast } = useToast();

    const handleStatChange = (id: string, value: number) => {
        setImpactStats(prev => prev.map(stat => stat.id === id ? { ...stat, value } : stat));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Impact Stats Manager</h2>
            <div className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {impactStats.map(stat => (
                        <div key={stat.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</label>
                            <input
                                type="number"
                                value={stat.value}
                                onChange={(e) => handleStatChange(parseInt(e.target.value, 10) || 0)}
                                className="mt-1 input-style"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-right">
                    <button onClick={() => showToast("Impact stats saved permanently!")} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 text-sm">
                        <Save className="h-4 w-4" /><span>Save Stats</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
const TestimonialsManager: React.FC = () => {
    const { testimonials, setTestimonials } = useAppData();
    const { showToast } = useToast();
    const [editing, setEditing] = useState<Testimonial | null>(null);

    const handleSave = (testimonial: Testimonial) => {
        setTestimonials(prev => {
            const existing = prev.find(t => t.id === testimonial.id);
            if (existing) {
                return prev.map(t => t.id === testimonial.id ? testimonial : t);
            }
            return [...prev, testimonial];
        });
        setEditing(null);
        showToast("Testimonial saved permanently!");
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            setTestimonials(prev => prev.filter(t => t.id !== id));
            showToast("Testimonial deleted permanently.");
        }
    };

    if (editing) {
        return <TestimonialForm testimonial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Testimonials Manager</h2>
                <button onClick={() => setEditing({ id: crypto.randomUUID(), name: '', role: '', quote: '', image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/EFEFEF/31343C?text=Upload' })} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    <Plus /><span>Add New</span>
                </button>
            </div>
            <div className="space-y-4">
                {testimonials.map(t => (
                    <div key={t.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-bold">{t.name} <span className="text-sm font-normal text-gray-500">- {t.role}</span></p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-1">"{t.quote}"</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditing(t)} className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const TestimonialForm: React.FC<{ testimonial: Testimonial, onSave: (t: Testimonial) => void, onCancel: () => void }> = ({ testimonial, onSave, onCancel }) => {
    const [formState, setFormState] = useState(testimonial);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormState(p => ({ ...p, image: reader.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">{testimonial.name ? 'Edit' : 'Add'} Testimonial</h2>
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 input-style" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Role</label>
                <input type="text" name="role" value={formState.role} onChange={handleChange} className="mt-1 input-style" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Image</label>
                <div className="mt-2 flex items-center space-x-4">
                    <img src={formState.image} alt={formState.name} className="h-20 w-20 rounded-full object-cover"/>
                    <div {...getRootProps()} className={`flex-grow p-4 border-2 border-dashed rounded-lg cursor-pointer text-center ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Quote</label>
                <textarea name="quote" value={formState.quote} onChange={handleChange} rows={3} className="mt-1 input-style" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2">
                    <Save className="h-4 w-4" /><span>Save Changes</span>
                </button>
            </div>
        </form>
    );
};
const EventsManager: React.FC = () => {
    const { events, setEvents } = useAppData();
    const { showToast } = useToast();
    const [editingEvent, setEditingEvent] = useState<MeetingSchedule | null>(null);
    const auditoriumEvents = events.filter(e => e.location === 'College Auditorium');

    const handleSave = (event: MeetingSchedule) => {
        setEvents(prev => {
            const existing = prev.find(e => e.id === event.id);
            if (existing) {
                return prev.map(e => e.id === event.id ? event : e);
            }
            return [...prev, event];
        });
        setEditingEvent(null);
        showToast("Event saved permanently!");
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            setEvents(prev => prev.filter(e => e.id !== id));
            showToast("Event deleted permanently.");
        }
    };

    if (editingEvent) {
        return <EventForm event={editingEvent} onSave={handleSave} onCancel={() => setEditingEvent(null)} />;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Auditorium Events Manager</h2>
                <button onClick={() => setEditingEvent({ id: crypto.randomUUID(), clubId: '', title: '', description: '', date: '', time: '', location: 'College Auditorium', type: 'event', hostingClub: '', auditionInfo: '', ticketUrl: '' })} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    <Plus /><span>Add New Event</span>
                </button>
            </div>
            <div className="space-y-4">
                {auditoriumEvents.map(event => (
                    <div key={event.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold">{event.title} <span className="text-sm font-normal text-gray-500">- {event.hostingClub}</span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(event.date).toLocaleDateString()} @ {event.time}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingEvent(event)} className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const EventForm: React.FC<{ event: MeetingSchedule, onSave: (e: MeetingSchedule) => void, onCancel: () => void }> = ({ event, onSave, onCancel }) => {
    const [formState, setFormState] = useState(event);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border-t dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">{event.title ? 'Edit' : 'Add'} Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Event Title</label>
                    <input type="text" name="title" value={formState.title} onChange={handleChange} className="mt-1 input-style" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Hosting Club</label>
                    <input type="text" name="hostingClub" value={formState.hostingClub} onChange={handleChange} className="mt-1 input-style" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input type="date" name="date" value={formState.date} onChange={handleChange} className="mt-1 input-style" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Time</label>
                    <input type="time" name="time" value={formState.time} onChange={handleChange} className="mt-1 input-style" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Event Type</label>
                    <select name="type" value={formState.type} onChange={handleChange} className="mt-1 input-style">
                        <option value="event">Event</option>
                        <option value="performance">Performance</option>
                        <option value="talk">Talk</option>
                        <option value="workshop">Workshop</option>
                        <option value="audition">Audition</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Ticket URL (Optional)</label>
                    <input type="url" name="ticketUrl" value={formState.ticketUrl || ''} onChange={handleChange} className="mt-1 input-style" placeholder="https://example.com/tickets" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Audition Info (Optional)</label>
                <textarea name="auditionInfo" value={formState.auditionInfo || ''} onChange={handleChange} rows={2} className="mt-1 input-style" placeholder="Details for auditions..."></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2">
                    <Save className="h-4 w-4" /><span>Save Event</span>
                </button>
            </div>
        </form>
    );
};
const ClubManager: React.FC = () => {
    const { clubs, setClubs, users, setUsers } = useUserData();
    const { showToast } = useToast();
    const [editingClub, setEditingClub] = useState<Club | null>(null);

    const handleSave = (club: Club) => {
        setClubs(prev => {
            const existing = prev.find(c => c.id === club.id);
            if (existing) {
                return prev.map(c => c.id === club.id ? club : c);
            }
            return [...prev, club];
        });
        setEditingClub(null);
        showToast("Club details saved permanently!");
    };

    if (editingClub) {
        return <ClubForm club={editingClub} onSave={handleSave} onCancel={() => setEditingClub(null)} leaders={users.filter(u => u.role === 'leader')} users={users} setUsers={setUsers} />;
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Club Manager</h2>
            <div className="space-y-4">
                {clubs.map(club => (
                    <div key={club.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={club.leaderAvatar} alt={club.leaderName} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-bold">{club.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Leader: {club.leaderName}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditingClub(club)} className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Edit className="h-4 w-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
const ClubForm: React.FC<{ club: Club, leaders: User[], onSave: (c: Club) => void, onCancel: () => void, users: User[], setUsers: (users: User[] | ((val: User[]) => User[])) => void }> = ({ club, leaders, onSave, onCancel, users, setUsers }) => {
    const [formState, setFormState] = useState(club);
    const { showToast } = useToast();
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormState(p => ({ ...p, leaderAvatar: reader.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] }, multiple: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'leaderId') {
            const leader = leaders.find(l => l.id === value);
            setFormState({ ...formState, leaderId: value, leaderName: leader?.name || '', leaderAvatar: leader?.avatar || '' });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    const handleOpenUserEditModal = () => {
        const leader = users.find(u => u.id === formState.leaderId);
        if (leader) {
            setEditingUser(leader);
            setIsUserEditModalOpen(true);
        } else {
            showToast("Please select a leader first.", "info");
        }
    };

    const handleSaveUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (updatedUser.id === formState.leaderId) {
            setFormState(prev => ({
                ...prev,
                leaderName: updatedUser.name,
                leaderAvatar: updatedUser.avatar || prev.leaderAvatar
            }));
        }
        setIsUserEditModalOpen(false);
        showToast("Leader details updated successfully!");
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border-t dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Edit Club: {club.name}</h2>
            <div>
                <label className="block text-sm font-medium">Club Name</label>
                <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 input-style" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Leader</label>
                <div className="flex items-center space-x-2">
                    <select name="leaderId" value={formState.leaderId} onChange={handleChange} className="mt-1 input-style flex-grow">
                        {leaders.map(leader => <option key={leader.id} value={leader.id}>{leader.name}</option>)}
                    </select>
                    <button type="button" onClick={handleOpenUserEditModal} title="Edit Leader Details" className="mt-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                        <Edit className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Leader Name</label>
                <input type="text" name="leaderName" value={formState.leaderName} onChange={handleChange} className="mt-1 input-style" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Leader Avatar</label>
                <div className="mt-2 flex items-center space-x-4">
                    <img src={formState.leaderAvatar} alt={formState.leaderName} className="h-20 w-20 rounded-full object-cover"/>
                    <div {...getRootProps()} className={`flex-grow p-4 border-2 border-dashed rounded-lg cursor-pointer text-center ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2">
                    <Save className="h-4 w-4" /><span>Save Club</span>
                </button>
            </div>
            <UserEditModal
                isOpen={isUserEditModalOpen}
                onClose={() => setIsUserEditModalOpen(false)}
                user={editingUser}
                onSave={handleSaveUser}
            />
        </form>
    );
};

const GalleryManager: React.FC = () => {
    const { galleryImages, setGalleryImages } = useAppData();
    const { showToast } = useToast();
    
    const [localImages, setLocalImages] = useState<GalleryImage[]>(galleryImages);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

    useEffect(() => {
        setLocalImages(galleryImages);
    }, [galleryImages]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const wasEmpty = localImages.length === 0;
        const newImages: GalleryImage[] = [];
        let filesProcessed = 0;

        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push({
                    id: crypto.randomUUID(),
                    src: reader.result as string,
                    caption: file.name || 'Newly uploaded image',
                    uploadedAt: new Date().toISOString(),
                });
                filesProcessed++;
                if (filesProcessed === acceptedFiles.length) {
                    setLocalImages(prevImages => wasEmpty ? newImages : [...newImages, ...prevImages]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (acceptedFiles.length > 0) {
            showToast(`${acceptedFiles.length} image(s) ready to be saved.`);
        }
    }, [localImages.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    });

    const handleSaveImageDetails = (updatedImage: GalleryImage) => {
        setLocalImages(prevImages =>
            prevImages.map(img => img.id === updatedImage.id ? updatedImage : img)
        );
        setEditingImage(null);
    };

    const handleDeleteImage = (id: string) => {
        setEditingImage(null);
        setDeletingImageId(id);
    };
    
    const confirmDeleteImage = () => {
        if (deletingImageId) {
            setLocalImages(prev => prev.filter(img => img.id !== deletingImageId));
            setDeletingImageId(null);
        }
    };

    const handleSaveGallery = () => {
        setGalleryImages(localImages);
        showToast("Gallery saved permanently!");
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gallery Manager</h2>
            <div
                {...getRootProps()}
                className={`p-10 border-2 border-dashed rounded-xl cursor-pointer text-center mb-8 transition-colors ${
                    isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {isDragActive ? 'Drop the files here ...' : "Drag 'n' drop images here, or click to select files"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This will replace the existing gallery images if it's the first upload in a session.</p>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click on an image to edit its details or delete it.
                </p>
                <button onClick={handleSaveGallery} className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <Save className="h-5 w-5" /><span>Save Gallery</span>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                    {localImages.map((image) => (
                        <motion.div
                            key={image.id}
                            className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setEditingImage(image)}
                        >
                            <img src={image.src} alt={image.caption} className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Edit className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black/60 to-transparent w-full">
                                <p className="text-white text-xs font-medium line-clamp-2">{image.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <ImageEditModal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                image={editingImage}
                onSave={handleSaveImageDetails}
                onDelete={handleDeleteImage}
            />
            <DeleteConfirmationModal
                isOpen={!!deletingImageId}
                onClose={() => setDeletingImageId(null)}
                onConfirm={confirmDeleteImage}
                itemName="image"
            />
        </div>
    );
};

const UserManager: React.FC = () => {
    const { users, setUsers } = useUserData();
    const { showToast } = useToast();
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleDeleteClick = (user: User) => {
        if (user.role === 'admin') {
            showToast("Admin users cannot be deleted.", "error");
            return;
        }
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            showToast(`User "${userToDelete.name}" has been deleted.`, "success");
            setUserToDelete(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Role</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                                        user.role === 'leader' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                                        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                    }`}>{user.role}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <button onClick={() => handleDeleteClick(user)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={user.role === 'admin'}>
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <DeleteConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                itemName={`user: ${userToDelete?.name}`}
            />
        </div>
    );
};

export default AdminDashboard;
