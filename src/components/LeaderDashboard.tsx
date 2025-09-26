import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Users, Calendar, Bell, Settings, Edit3, Trash2, Moon, Sun, Save, XCircle, Twitter, Linkedin, Globe, Image as ImageIcon, User, UploadCloud, Check, X, MailOpen, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useUserData } from '../context/UserDataContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import Header from './Header';
import { Club, ClubMember, Announcement, MeetingSchedule, User as UserType } from '../types';
import MemberModal from './MemberModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AnnouncementModal from './AnnouncementModal';
import MeetingModal from './MeetingModal';
import ClubAnalytics from './ClubAnalytics';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const LeaderDashboard: React.FC = () => {
  const { clubs, setClubs, clubMembers, setClubMembers, announcements, setAnnouncements, meetings, setMeetings, users, currentUser } = useUserData();
  const { setNotifications } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const leaderClubs = useMemo(() => {
    if (currentUser && currentUser.role === 'leader') {
      return clubs.filter(club => club.leaderId === currentUser.id);
    }
    return [];
  }, [clubs, currentUser]);
  
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'leader') {
        setTimeout(() => navigate('/leader-login'), 100);
    } else if (leaderClubs.length > 0 && !selectedClubId) {
        setSelectedClubId(leaderClubs[0].id);
    }
  }, [currentUser, leaderClubs, selectedClubId, navigate]);

  const currentClub = useMemo(() => clubs.find(c => c.id === selectedClubId), [clubs, selectedClubId]);
  const currentMembers = useMemo(() => clubMembers.filter(m => m.clubId === selectedClubId), [clubMembers, selectedClubId]);
  const currentAnnouncements = useMemo(() => announcements.filter(a => a.clubId === selectedClubId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [announcements, selectedClubId]);
  const currentMeetings = useMemo(() => meetings.filter(m => m.clubId === selectedClubId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [meetings, selectedClubId]);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<MeetingSchedule | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'member' | 'announcement' | 'meeting' } | null>(null);

  const handleSaveMember = (memberData: ClubMember) => {
    setClubMembers(prev => {
        const existing = prev.find((m: ClubMember) => m.id === memberData.id);
        if (existing) {
            return prev.map((m: ClubMember) => m.id === memberData.id ? memberData : m);
        }
        return [{ ...memberData, clubId: selectedClubId }, ...prev];
    });
    setIsMemberModalOpen(false);
    setEditingMember(null);
    showToast("Member saved permanently!");
  };
  
  const handleSaveAnnouncement = (announcementData: Announcement) => {
    setAnnouncements(prev => {
      const existing = prev.find((a: Announcement) => a.id === announcementData.id);
      if (existing) {
        return prev.map((a: Announcement) => a.id === announcementData.id ? announcementData : a);
      }
      return [{ ...announcementData, clubId: selectedClubId }, ...prev];
    });
    setIsAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
    showToast("Announcement saved permanently!");
  };

  const handleSaveMeeting = (meetingData: MeetingSchedule) => {
    setMeetings(prev => {
      const existing = prev.find((m: MeetingSchedule) => m.id === meetingData.id);
      if (existing) {
        return prev.map((m: MeetingSchedule) => m.id === meetingData.id ? meetingData : m)
      }
      return [{ ...meetingData, clubId: selectedClubId }, ...prev];
    });
    setIsMeetingModalOpen(false);
    setEditingMeeting(null);
    showToast("Meeting saved permanently!");
  };

  const openDeleteModal = (id: string, type: 'member' | 'announcement' | 'meeting') => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    
    if (type === 'member') setClubMembers(prev => prev.filter((m: ClubMember) => m.id !== id));
    if (type === 'announcement') setAnnouncements(prev => prev.filter((a: Announcement) => a.id !== id));
    if (type === 'meeting') setMeetings(prev => prev.filter((m: MeetingSchedule) => m.id !== id));
    
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted permanently.`);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  const handleAcceptRequest = (memberId: string) => {
    setClubMembers(prev => prev.map((m: ClubMember) => m.id === memberId ? { ...m, status: 'active' } : m));
    const member = currentMembers.find((m: ClubMember) => m.id === memberId);
    if(member && currentClub) {
      showToast(`${member.userName} accepted into the club.`, 'success');
      setNotifications(prev => [{
        id: crypto.randomUUID(),
        content: `Your request to join "${currentClub.name}" has been approved!`,
        createdAt: new Date().toISOString(),
        read: false
      }, ...prev]);
    }
  };

  const handleDeclineRequest = (memberId: string) => {
    const member = currentMembers.find((m: ClubMember) => m.id === memberId);
    setClubMembers(prev => prev.filter((m: ClubMember) => m.id !== memberId));
    if(member && currentClub) {
      showToast(`${member.userName}'s request has been declined.`, 'info');
      setNotifications(prev => [{
        id: crypto.randomUUID(),
        content: `Your request to join "${currentClub.name}" has been declined.`,
        createdAt: new Date().toISOString(),
        read: false
      }, ...prev]);
    }
  };

  const pendingRequestCount = currentMembers.filter((m: ClubMember) => m.status === 'pending').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'requests', label: 'Requests', icon: MailOpen, count: pendingRequestCount },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    if (!currentClub) return <div className="p-6 text-center">Loading club data...</div>;

    switch (selectedTab) {
      case 'overview': return <ClubAnalytics members={currentMembers} meetings={currentMeetings} />;
      case 'requests': return <RequestsTab members={currentMembers} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} />;
      case 'members': return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Members ({currentMembers.filter((m: ClubMember) => m.status === 'active').length})</h2>
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
                {currentMembers.filter((m: ClubMember) => m.status === 'active').map((member: ClubMember) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{member.userName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{member.userEmail}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full capitalize bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}>{member.status}</span></td>
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
            {currentAnnouncements.map((ann: Announcement) => (
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
            {currentMeetings.map((meet: MeetingSchedule) => (
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
      case 'settings': return <SettingsTab club={currentClub} setClubs={setClubs} leaders={users.filter(u => u.role === 'leader')} />;
      default: return null;
    }
  };

  if (!currentUser || currentUser.role !== 'leader') {
    return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  if (leaderClubs.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header userRole="leader" userName={currentUser.name} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h2 className="text-2xl font-bold">No Clubs Found</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">You are not currently assigned as a leader to any club.</p>
            </div>
        </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header userRole="leader" userName={currentUser.name} />
      
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
                {tabs.map(tab => (<button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`w-full flex items-center justify-between space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors ${selectedTab === tab.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count && tab.count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{tab.count}</span>
                  )}
                </button>))}
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

      <MemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} onSave={handleSaveMember} memberToEdit={editingMember}/>
      <AnnouncementModal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} onSave={handleSaveAnnouncement} announcementToEdit={editingAnnouncement}/>
      <MeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} onSave={handleSaveMeeting} meetingToEdit={editingMeeting}/>
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete?.type}/>
    </motion.div>
  );
};

const RequestsTab: React.FC<{
  members: ClubMember[],
  onAccept: (memberId: string) => void,
  onDecline: (memberId: string) => void
}> = ({ members, onAccept, onDecline }) => {
  const pendingMembers = members.filter(m => m.status === 'pending');

  if (pendingMembers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <MailOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold">No Pending Requests</h3>
        <p>You're all caught up! There are no new requests to join your club.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Join Requests ({pendingMembers.length})</h2>
      <div className="space-y-4">
        {pendingMembers.map(member => (
          <div key={member.id} className="p-4 border dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{member.userName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.userEmail}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requested on: {new Date(member.joinedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button onClick={() => onDecline(member.id)} className="px-4 py-2 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 flex items-center space-x-2">
                <X className="h-4 w-4" /><span>Decline</span>
              </button>
              <button onClick={() => onAccept(member.id)} className="px-4 py-2 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 flex items-center space-x-2">
                <Check className="h-4 w-4" /><span>Accept</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab: React.FC<{ club: Club, setClubs: (value: Club[] | ((val: Club[]) => Club[])) => void, leaders: UserType[] }> = ({ club, setClubs, leaders }) => {
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const [editedClub, setEditedClub] = useState(club);

    useEffect(() => {
        setEditedClub(club);
    }, [club]);

    const handleClubDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'leaderId') {
            const leader = leaders.find(u => u.id === value);
            setEditedClub(prev => ({ ...prev, leaderId: value, leaderName: leader?.name || '', leaderAvatar: leader?.avatar || '' }));
        } else {
            setEditedClub(prev => ({ ...prev, [name]: value }));
        }
    };

    const onBannerDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedClub(p => ({ ...p, bannerImage: reader.result as string }));
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);
    const { getRootProps: getBannerRootProps, getInputProps: getBannerInputProps } = useDropzone({ onDrop: onBannerDrop, accept: { 'image/*': [] }, multiple: false });

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedClub(prev => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedClub(prev => ({ ...prev, isRecruiting: e.target.checked }));
    };

    const handleSaveChanges = () => {
        setClubs(prevClubs => prevClubs.map(c => c.id === editedClub.id ? editedClub : c));
        showToast("Club settings saved permanently!");
    };

    return (
        <div className="p-6 space-y-12">
            <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Club Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Club Name</label>
                        <input type="text" name="name" value={editedClub.name} onChange={handleClubDetailsChange} className="mt-1 px-3 py-2 input-style"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" value={editedClub.description} onChange={handleClubDetailsChange} rows={3} className="mt-1 px-3 py-2 input-style"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Welcome Message for New Members</label>
                        <textarea name="welcomeMessage" value={editedClub.welcomeMessage || ''} onChange={handleClubDetailsChange} rows={3} className="mt-1 px-3 py-2 input-style" placeholder="e.g., Welcome to the club! We're excited to have you."/>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recruiting new members</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isRecruiting" checked={editedClub.isRecruiting} onChange={handleToggleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance & Socials</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Club Banner Image</label>
                        <div {...getBannerRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer">
                            <div className="space-y-1 text-center">
                                {editedClub.bannerImage ? <img src={editedClub.bannerImage} alt="Banner preview" className="mx-auto h-24 rounded-md" /> : <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />}
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <p className="pl-1">Upload a file or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="website" value={editedClub.socials?.website || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Website URL" />
                    </div>
                    <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="twitter" value={editedClub.socials?.twitter || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="Twitter URL" />
                    </div>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" name="linkedin" value={editedClub.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full pl-10 px-3 py-2 input-style" placeholder="LinkedIn URL" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                <button onClick={handleSaveChanges} className="px-6 py-2.5 bg-blue-600 text-white rounded-md flex items-center space-x-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <Save className="h-5 w-5" /><span>Save All Settings</span>
                </button>
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
