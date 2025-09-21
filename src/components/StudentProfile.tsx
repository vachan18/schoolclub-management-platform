import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { User as UserIcon, UploadCloud, Edit, Save, Mail, Phone, Hash, Briefcase, Award, Plus, Trash2, X, XCircle, Rocket, Star, Trophy, CalendarCheck } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import { useToast } from '../context/ToastContext';
import { User, Achievement } from '../types';

const SaveChangesBar: React.FC<{ onSave: () => void; onDiscard: () => void; }> = ({ onSave, onDiscard }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-[150]"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">You have unsaved changes.</p>
      <div className="flex space-x-3">
        <button onClick={onDiscard} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center space-x-2">
          <XCircle className="h-4 w-4" />
          <span>Discard</span>
        </button>
        <button onClick={onSave} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  </motion.div>
);

const iconMap: { [key: string]: React.ElementType } = {
    Rocket, Star, Trophy, CalendarCheck
};

const StudentProfile: React.FC<{ student: User }> = ({ student }) => {
    const { setUsers } = useUserData();
    const { showToast } = useToast();
    const [originalProfile, setOriginalProfile] = useState<User>(() => JSON.parse(JSON.stringify(student)));
    const [editedProfile, setEditedProfile] = useState<User>(() => JSON.parse(JSON.stringify(student)));
    const [isEditing, setIsEditing] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '' });

    useEffect(() => {
        setOriginalProfile(JSON.parse(JSON.stringify(student)));
        setEditedProfile(JSON.parse(JSON.stringify(student)));
    }, [student]);

    const isDirty = useMemo(() => JSON.stringify(originalProfile) !== JSON.stringify(editedProfile), [originalProfile, editedProfile]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedProfile(p => ({ ...p, avatar: e.target?.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setOriginalProfile(editedProfile);
        setIsEditing(false);
        showToast("Profile saved successfully!");
    };

    const handleDiscard = () => {
        setEditedProfile(originalProfile);
        setIsEditing(false);
    };

    const handleToggleEdit = () => {
        if (isEditing && isDirty) {
            if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                handleDiscard();
            }
        } else {
            setIsEditing(!isEditing);
        }
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
            <div className="bg-foreground dark:bg-foreground rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img src={editedProfile.avatar} alt={editedProfile.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/50" />
                        {isEditing && (
                            <div {...getRootProps()} className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                <input {...getInputProps()} />
                                <UploadCloud className="h-8 w-8 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        {isEditing ? (
                            <input type="text" name="name" value={editedProfile.name} onChange={handleInputChange} className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{editedProfile.name}</h1>
                        )}
                        <p className="text-primary font-medium capitalize">{editedProfile.role}</p>
                    </div>
                    <div className="ml-auto">
                        <button onClick={handleToggleEdit} className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField icon={Mail} label="Email" value={editedProfile.email} name="email" />
                    <InfoField icon={Phone} label="Contact" value={editedProfile.contact} name="contact" />
                    <InfoField icon={Hash} label="USN" value={editedProfile.usn} name="usn" />
                    <InfoField icon={Briefcase} label="Branch" value={editedProfile.branch} name="branch" />
                </div>
                
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
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isDirty && isEditing && <SaveChangesBar onSave={handleSave} onDiscard={handleDiscard} />}
            </AnimatePresence>
        </div>
    );
};

export default StudentProfile;
