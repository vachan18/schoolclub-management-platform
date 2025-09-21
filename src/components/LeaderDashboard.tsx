import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Users, Calendar, Bell, Settings, Edit3, Trash2, Moon, Sun, Save, XCircle, Twitter, Linkedin, Globe, Image as ImageIcon, User, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useUserData } from '../context/UserDataContext';
import Header from './Header';
import { Club, ClubMember, Announcement, MeetingSchedule, User as UserType } from '../types';
import MemberModal from './MemberModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AnnouncementModal from './AnnouncementModal';
import MeetingModal from './MeetingModal';
import ClubAnalytics from './ClubAnalytics';
import { useTheme } from '../context/ThemeContext';

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

const LeaderDashboard: React.FC = () => {
  const { clubs, setClubs, clubMembers, setClubMembers, announcements, setAnnouncements, meetings, setMeetings, users } = useUserData();
  
  const leaderClubs = useMemo(() => clubs.filter(c => users.find(u => u.id === c.leaderId && u.role === 'leader')), [clubs, users]);
  
  const [selectedClubId, setSelectedClubId] = useState<string>(leaderClubs[0]?.id || '');
  const [selectedTab, setSelectedTab] = useState('overview');

  const [originalData, setOriginalData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<MeetingSchedule | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'member' | 'announcement' | 'meeting' } | null>(null);

  useEffect(() => {
    if (!selectedClubId) return;
    const club = clubs.find(c => c.id === selectedClubId)!;
    const data = {
      clubDetails: { ...club },
      members: clubMembers.filter(m => m.clubId === selectedClubId),
      announcements: announcements.filter(a => a.clubId === selectedClubId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      meetings: meetings.filter(m => m.clubId === selectedClubId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
    setOriginalData(JSON.parse(JSON.stringify(data)));
    setEditedData(JSON.parse(JSON.stringify(data)));
  }, [selectedClubId, clubs, clubMembers, announcements, meetings]);

  const isDirty = useMemo(() => JSON.stringify(originalData) !== JSON.stringify(editedData), [originalData, editedData]);

  const handleSaveAll = () => {
    if (!editedData) return;
    setClubs(prevClubs => prevClubs.map(c => c.id === selectedClubId ? editedData.clubDetails : c));
    setClubMembers(prev => [...prev.filter(m => m.clubId !== selectedClubId), ...editedData.members]);
    setAnnouncements(prev => [...prev.filter(a => a.clubId !== selectedClubId), ...editedData.announcements]);
    setMeetings(prev => [...prev.filter(m => m.clubId !== selectedClubId), ...editedData.meetings]);
    
    setOriginalData(JSON.parse(JSON.stringify(editedData)));
    alert('All changes saved successfully!');
  };

  const handleDiscardAll = () => setEditedData(JSON.parse(JSON.stringify(originalData)));

  const handleSaveMember = (memberData: ClubMember) => {
    setEditedData((prev: any) => {
        const existing = prev.members.find((m: ClubMember) => m.id === memberData.id);
        const members = existing 
            ? prev.members.map((m: ClubMember) => m.id === memberData.id ? memberData : m)
            : [{ ...memberData, clubId: selectedClubId }, ...prev.members];
        return { ...prev, members };
    });
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };
  
  const handleSaveAnnouncement = (announcementData: Announcement) => {
    setEditedData((prev: any) => {
      const existing = prev.announcements.find((a: Announcement) => a.id === announcementData.id);
      const announcements = existing
        ? prev.announcements.map((a: Announcement) => a.id === announcementData.id ? announcementData : a)
        : [{ ...announcementData, clubId: selectedClubId }, ...prev.announcements];
      return { ...prev, announcements: announcements.sort((a:Announcement,b:Announcement) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
    });
    setIsAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSaveMeeting = (meetingData: MeetingSchedule) => {
    setEditedData((prev: any) => {
      const existing = prev.meetings.find((m: MeetingSchedule) => m.id === meetingData.id);
      const meetings = existing
        ? prev.meetings.map((m: MeetingSchedule) => m.id === meetingData.id ? meetingData : m)
        : [{ ...meetingData, clubId: selectedClubId }, ...prev.meetings];
      return { ...prev, meetings: meetings.sort((a:MeetingSchedule,b:MeetingSchedule) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
    });
    setIsMeetingModalOpen(false);
    setEditingMeeting(null);
  };

  const openDeleteModal = (id: string, type: 'member' | 'announcement' | 'meeting') => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete || !editedData) return;
    const { id, type } = itemToDelete;
    setEditedData((prev: any) => {
        const updatedData = { ...prev };
        if (type === 'member') updatedData.members = prev.members.filter((m: ClubMember) => m.id !== id);
        if (type === 'announcement') updatedData.announcements = prev.announcements.filter((a: Announcement) => a.id !== id);
        if (type === 'meeting') updatedData.meetings = prev.meetings.filter((m: MeetingSchedule) => m.id !== id);
        return updatedData;
    });
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'settings', label: 'Settings' },
  ];

  const renderContent = () => {
    if (!editedData) return <div className="p-6 text-center">Loading club data...</div>;

    const { members, announcements, meetings } = editedData;

    switch (selectedTab) {
      case 'overview': return <ClubAnalytics members={members} meetings={meetings} />;
      case 'members': return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Members ({members.length})</h2>
            <button onClick={() => { setEditingMember(null); setIsMemberModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="h-4 w-4" /><span>Add Member</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member: ClubMember) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{member.userName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{member.userEmail}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full capitalize ${member.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{member.status}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditingMember(member); setIsMemberModalOpen(true); }} className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => openDeleteModal(member.id, 'member')} className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      case 'announcements': return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Announcements</h2>
            <button onClick={() => { setEditingAnnouncement(null); setIsAnnouncementModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="h-4 w-4" /><span>New Announcement</span>
            </button>
          </div>
          <div className="space-y-4">
            {announcements.map((ann: Announcement) => (
              <div key={ann.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-start bg-white dark:bg-gray-800">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{ann.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ann.content}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{new Date(ann.createdAt).toLocaleString()} | Priority: </span>
                    <span className={`font-medium capitalize ${ann.priority === 'high' ? 'text-red-600' : ann.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{ann.priority}</span>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <button onClick={() => { setEditingAnnouncement(ann); setIsAnnouncementModalOpen(true); }} className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => openDeleteModal(ann.id, 'announcement')} className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'meetings': return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Meetings & Events</h2>
            <button onClick={() => { setEditingMeeting(null); setIsMeetingModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="h-4 w-4" /><span>Schedule Event</span>
            </button>
          </div>
          <div className="space-y-4">
            {meetings.map((meet: MeetingSchedule) => (
              <div key={meet.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-start bg-white dark:bg-gray-800">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{meet.title} <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full ml-2 capitalize">{meet.type}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{meet.description}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2">{new Date(meet.date).toLocaleDateString()} at {meet.time} - {meet.location}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <button onClick={() => { setEditingMeeting(meet); setIsMeetingModalOpen(true); }} className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => openDeleteModal(meet.id, 'meeting')} className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'settings': return <SettingsTab editedData={editedData} setEditedData={setEditedData} leaders={users.filter(u => u.role === 'leader')} />;
      default: return null;
    }
  };

  if (!selectedClubId && leaderClubs.length > 0) {
    setSelectedClubId(leaderClubs[0].id);
    return null;
  }

  if (leaderClubs.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header userRole="leader" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h2 className="text-2xl font-bold">No Clubs Found</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">You are not assigned as a leader to any club.</p>
            </div>
        </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header userRole="leader" userName={editedData?.clubDetails.leaderName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <select value={selectedClubId} onChange={(e) => setSelectedClubId(e.target.value)} className="w-full md:w-auto px-4 py-2 border-none rounded-md text-xl font-bold focus:ring-0 bg-transparent dark:text-white">
            {leaderClubs.map(club => (<option key={club.id} value={club.id}>{club.name}</option>))}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-28 border border-gray-200 dark:border-gray-700">
              <nav className="space-y-1">
                {tabs.map(tab => (<button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${selectedTab === tab.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><span>{tab.label}</span></button>))}
              </nav>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[600px] border border-gray-200 dark:border-gray-700">
              <AnimatePresence mode="wait">
                <motion.div key={selectedTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isDirty && <SaveChangesBar onSave={handleSaveAll} onDiscard={handleDiscardAll} />}
      </AnimatePresence>

      <MemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} onSave={handleSaveMember} memberToEdit={editingMember}/>
      <AnnouncementModal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} onSave={handleSaveAnnouncement} announcementToEdit={editingAnnouncement}/>
      <MeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} onSave={handleSaveMeeting} meetingToEdit={editingMeeting}/>
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete?.type}/>
    </motion.div>
  );
};

const SettingsTab: React.FC<{ editedData: any, setEditedData: React.Dispatch<React.SetStateAction<any>>, leaders: UserType[] }> = ({ editedData, setEditedData, leaders }) => {
    const { theme, toggleTheme } = useTheme();

    const handleClubDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'leaderId') {
            const leader = leaders.find(u => u.id === value);
            setEditedData((prev: any) => ({
                ...prev,
                clubDetails: { 
                    ...prev.clubDetails, 
                    leaderId: value,
                    leaderName: leader?.name || '', 
                    leaderAvatar: leader?.avatar || '' 
                }
            }));
        } else {
            setEditedData((prev: any) => ({
                ...prev,
                clubDetails: { ...prev.clubDetails, [name]: value }
            }));
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditedData((prev: any) => ({
                ...prev,
                clubDetails: { ...prev.clubDetails, leaderAvatar: previewUrl }
            }));
        }
    }, [setEditedData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
        multiple: false,
    });

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData((prev: any) => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, socials: { ...prev.clubDetails.socials, [name]: value } }
        }));
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedData((prev: any) => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, isRecruiting: e.target.checked }
        }));
    };

    const { clubDetails } = editedData;

    return (
        <div className="p-6 space-y-12">
            <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Club Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Club Name</label>
                        <input type="text" name="name" value={clubDetails.name} onChange={handleClubDetailsChange} className="mt-1 px-3 py-2 input-style"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" value={clubDetails.description} onChange={handleClubDetailsChange} rows={3} className="mt-1 px-3 py-2 input-style"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recruiting new members</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isRecruiting" checked={clubDetails.isRecruiting} onChange={handleToggleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leader & Profile</h3>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Club Leader</label>
                        <select name="leaderId" value={clubDetails.leaderId} onChange={handleClubDetailsChange} className="mt-1 px-3 py-2 input-style">
                            {leaders.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leader Name</label>
                        <input type="text" name="leaderName" value={clubDetails.leaderName} onChange={handleClubDetailsChange} className="mt-1 px-3 py-2 input-style"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leader Profile Picture</label>
                        <div className="mt-2 flex items-center space-x-4">
                            {clubDetails.leaderAvatar ? (
                                <img src={clubDetails.leaderAvatar} alt={clubDetails.leaderName} className="h-20 w-20 rounded-full object-cover"/>
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="h-10 w-10 text-gray-500" />
                                </div>
                            )}
                            <div {...getRootProps()} className={`flex-grow p-4 border-2 border-dashed rounded-lg cursor-pointer text-center ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                                <input {...getInputProps()} />
                                <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {isDragActive ? 'Drop the image here' : 'Drag & drop or click to upload'}
                                </p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance & Socials</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">Theme</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode.</p>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
                        </button>
                    </div>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="logoUrl" value={clubDetails.logoUrl || ''} onChange={handleClubDetailsChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Club Logo URL" />
                    </div>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="website" value={clubDetails.socials?.website || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Website URL" />
                    </div>
                    <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="twitter" value={clubDetails.socials?.twitter || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Twitter URL" />
                    </div>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="linkedin" value={clubDetails.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="LinkedIn URL" />
                    </div>
                </div>
            </div>

            <div className="max-w-2xl pt-8 border-t border-red-200 dark:border-red-900/50">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Danger Zone</h3>
                <div className="mt-4 p-4 border border-red-300 dark:border-red-700 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delete this club</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Once deleted, this is irreversible.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete Club</button>
                </div>
            </div>
        </div>
    );
};

export default LeaderDashboard;
