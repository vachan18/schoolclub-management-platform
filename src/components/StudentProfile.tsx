import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { User as UserIcon, UploadCloud, Edit, Save, Mail, Phone, Hash, Briefcase, Award, Plus, Trash2, X, Rocket, Star, Trophy, CalendarCheck, Users } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import { useToast } from '../context/ToastContext';
import { User, Achievement, Club } from '../types';

const iconMap: { [key: string]: React.ElementType } = {
    Rocket, Star, Trophy, CalendarCheck
};

const StudentProfile: React.FC<{ student: User }> = ({ student }) => {
    const { setUsers, clubs, clubMembers } = useUserData();
    const { showToast } = useToast();
    
    const [editedProfile, setEditedProfile] = useState<User>(() => JSON.parse(JSON.stringify(student)));
    const [isEditing, setIsEditing] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '' });

    useEffect(() => {
        setEditedProfile(JSON.parse(JSON.stringify(student)));
    }, [student]);

    const myClubs = useMemo(() => {
        const memberOfClubIds = clubMembers
            .filter(m => m.userId === student.id && m.status === 'active')
            .map(m => m.clubId);
        return clubs.filter(c => memberOfClubIds.includes(c.id));
    }, [clubs, clubMembers, student.id]);

    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedProfile(p => ({ ...p, avatar: reader.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);
    
    const onBannerDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedProfile(p => ({ ...p, banner: reader.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({ onDrop: onAvatarDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] }, multiple: false });
    const { getRootProps: getBannerRootProps, getInputProps: getBannerInputProps } = useDropzone({ onDrop: onBannerDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] }, multiple: false });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedProfile(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleAddInterest = () => {
        if (newInterest && !editedProfile.interests?.includes(newInterest)) {
            setEditedProfile(p => ({ ...p, interests: [...(p.interests || []), newInterest] }));
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interestToRemove: string) => {
        setEditedProfile(p => ({ ...p, interests: p.interests?.filter(i => i !== interestToRemove) }));
    };

    const handleAddCert = () => {
        if (newCert.name && newCert.issuer && newCert.date) {
            setEditedProfile(p => ({ ...p, certifications: [...(p.certifications || []), { id: crypto.randomUUID(), ...newCert }] }));
            setNewCert({ name: '', issuer: '', date: '' });
        }
    };
    
    const handleRemoveCert = (id: string) => {
        setEditedProfile(p => ({ ...p, certifications: p.certifications?.filter(c => c.id !== id)}));
    };

    const handleSave = () => {
        setUsers(prevUsers => prevUsers.map(u => u.id === editedProfile.id ? editedProfile : u));
        setIsEditing(false);
        showToast("Profile saved successfully!");
    };

    const handleDiscard = () => {
        setEditedProfile(student);
        setIsEditing(false);
    };

    const InfoField = ({ icon: Icon, label, value, name }: { icon: React.ElementType, label: string, value?: string, name: string }) => (
        <div className="flex items-center space-x-4">
            <Icon className="h-5 w-5 text-gray-500" />
            <div className="flex-grow">
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                {isEditing ? (
                    <input type="text" name={name} value={value || ''} onChange={handleInputChange} className="text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 w-full" />
                ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || 'Not set'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="py-8">
            <div className="relative bg-foreground dark:bg-foreground rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                {/* Banner */}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    {editedProfile.banner && <img src={editedProfile.banner} alt="Profile banner" className="w-full h-full object-cover" />}
                    {isEditing && (
                        <div {...getBannerRootProps()} className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                            <input {...getBannerInputProps()} />
                            <UploadCloud className="h-8 w-8 text-white" />
                            <span className="ml-2 text-white font-semibold">Change Banner</span>
                        </div>
                    )}
                </div>

                {/* Profile Header */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 relative">
                        <div className="relative">
                            <img src={editedProfile.avatar} alt={editedProfile.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" />
                            {isEditing && (
                                <div {...getAvatarRootProps()} className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                    <input {...getAvatarInputProps()} />
                                    <UploadCloud className="h-8 w-8 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-grow">
                            {isEditing ? (
                                <input type="text" name="name" value={editedProfile.name} onChange={handleInputChange} className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500" />
                            ) : (
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{editedProfile.name}</h1>
                            )}
                            <p className="text-primary font-medium capitalize">{editedProfile.role}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                                    <Edit className="h-5 w-5" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button onClick={handleDiscard} className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md">
                                        <X className="h-5 w-5" />
                                        <span>Cancel</span>
                                    </button>
                                    <button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                        <Save className="h-5 w-5" />
                                        <span>Save</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bio</h3>
                        {isEditing ? (
                             <textarea name="bio" value={editedProfile.bio || ''} onChange={handleInputChange} className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 w-full rounded-md p-2" rows={3}/>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{editedProfile.bio || 'No bio set. Click "Edit Profile" to add one!'}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t border-gray-200 dark:border-gray-700">
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{editedProfile.contributionPoints}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contribution Points</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{myClubs.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Clubs Joined</p>
                    </div>
                     <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{editedProfile.achievements?.length || 0}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Achievements</p>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField icon={Mail} label="Email" value={editedProfile.email} name="email" />
                    <InfoField icon={Phone} label="Contact" value={editedProfile.contact} name="contact" />
                    <InfoField icon={Hash} label="USN" value={editedProfile.usn} name="usn" />
                    <InfoField icon={Briefcase} label="Branch" value={editedProfile.branch} name="branch" />
                </div>

                {myClubs.length > 0 && (
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> My Clubs</h3>
                        <div className="flex flex-wrap gap-4">
                            {myClubs.map(club => (
                                <div key={club.id} className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                    <img src={club.logoUrl} alt={club.name} className="h-10 w-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{club.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{club.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {editedProfile.interests?.map(interest => (
                            <div key={interest} className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                                <span>{interest}</span>
                                {isEditing && <button onClick={() => handleRemoveInterest(interest)} className="ml-2 text-blue-500 hover:text-blue-700"><X className="h-3 w-3" /></button>}
                            </div>
                        ))}
                    </div>
                    {isEditing && (
                        <div className="mt-4 flex gap-2">
                            <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add new interest" className="input-style flex-grow" />
                            <button onClick={handleAddInterest} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"><Plus className="h-5 w-5" /></button>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h3>
                    <div className="space-y-4">
                        {editedProfile.certifications?.map(cert => (
                            <div key={cert.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Award className="h-6 w-6 text-yellow-500" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{cert.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer} - {cert.date}</p>
                                    </div>
                                </div>
                                {isEditing && <button onClick={() => handleRemoveCert(cert.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>}
                            </div>
                        ))}
                         {editedProfile.certifications?.length === 0 && !isEditing && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No certifications added yet.</p>
                        )}
                    </div>
                    {isEditing && (
                        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <h4 className="text-md font-medium">Add New Certification</h4>
                            <input type="text" value={newCert.name} onChange={(e) => setNewCert(c => ({...c, name: e.target.value}))} placeholder="Certification Name" className="input-style" />
                            <input type="text" value={newCert.issuer} onChange={(e) => setNewCert(c => ({...c, issuer: e.target.value}))} placeholder="Issuer (e.g., Coursera)" className="input-style" />
                            <input type="date" value={newCert.date} onChange={(e) => setNewCert(c => ({...c, date: e.target.value}))} className="input-style" />
                            <button onClick={handleAddCert} className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center space-x-2">
                                <Plus className="h-5 w-5" /> <span>Add Certificate</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {editedProfile.achievements?.map((ach: Achievement) => {
                            const Icon = iconMap[ach.icon] || Star;
                            return (
                                <div key={ach.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center" title={ach.description}>
                                    <Icon className="h-10 w-10 text-yellow-500 mb-2" />
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{ach.name}</p>
                                </div>
                            );
                        })}
                        {editedProfile.achievements?.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center">No achievements unlocked yet. Keep participating!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
