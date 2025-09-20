import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Bell, Settings, BarChart3, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockClubs, mockClubMembers, mockAnnouncements, mockMeetingSchedules } from '../data/mockData';
import Header from './Header';
import { Club, ClubMember, Announcement, MeetingSchedule } from '../types';
import MemberModal from './MemberModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AnnouncementModal from './AnnouncementModal';
import MeetingModal from './MeetingModal';

const LeaderDashboard: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [selectedClub, setSelectedClub] = useState<Club>(clubs[0]);
  const [selectedTab, setSelectedTab] = useState('overview');

  // State for members, announcements, and meetings
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [clubAnnouncements, setClubAnnouncements] = useState<Announcement[]>([]);
  const [clubMeetings, setClubMeetings] = useState<MeetingSchedule[]>([]);

  // Modal states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for items to be edited or deleted
  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<MeetingSchedule | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'member' | 'announcement' | 'meeting' } | null>(null);

  // State for the settings form, moved to the top level to fix hook error
  const [settingsFormState, setSettingsFormState] = useState<Club>(selectedClub);

  // Update data when selected club changes
  useEffect(() => {
    setClubMembers(mockClubMembers.filter(member => member.clubId === selectedClub.id));
    setClubAnnouncements(mockAnnouncements.filter(ann => ann.clubId === selectedClub.id));
    setClubMeetings(mockMeetingSchedules.filter(meeting => meeting.clubId === selectedClub.id));
    // Also update the settings form state when the club changes
    setSettingsFormState(selectedClub);
  }, [selectedClub]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // --- CRUD Handlers ---
  const handleSaveMember = (memberData: ClubMember) => {
    setClubMembers(prev => editingMember ? prev.map(m => m.id === memberData.id ? memberData : m) : [{ ...memberData, clubId: selectedClub.id }, ...prev]);
    setIsMemberModalOpen(false);
  };

  const handleSaveAnnouncement = (announcementData: Announcement) => {
    setClubAnnouncements(prev => editingAnnouncement ? prev.map(a => a.id === announcementData.id ? announcementData : a) : [{ ...announcementData, clubId: selectedClub.id }, ...prev]);
    setIsAnnouncementModalOpen(false);
  };

  const handleSaveMeeting = (meetingData: MeetingSchedule) => {
    setClubMeetings(prev => editingMeeting ? prev.map(m => m.id === meetingData.id ? meetingData : m) : [{ ...meetingData, clubId: selectedClub.id }, ...prev]);
    setIsMeetingModalOpen(false);
  };
  
  const handleSaveClubSettings = (updatedClub: Club) => {
    setSelectedClub(updatedClub);
    setClubs(prev => prev.map(c => c.id === updatedClub.id ? updatedClub : c));
    alert("Club settings saved!");
  };

  const openDeleteModal = (id: string, type: 'member' | 'announcement' | 'meeting') => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    if (type === 'member') setClubMembers(prev => prev.filter(m => m.id !== id));
    if (type === 'announcement') setClubAnnouncements(prev => prev.filter(a => a.id !== id));
    if (type === 'meeting') setClubMeetings(prev => prev.filter(m => m.id !== id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // --- UI Component Renderers ---

  const renderOverview = () => (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Club Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: clubMembers.length },
          { label: 'Active Members', value: clubMembers.filter(m => m.status === 'active').length },
          { label: 'Pending Requests', value: clubMembers.filter(m => m.status === 'pending').length },
          { label: 'Upcoming Events', value: clubMeetings.filter(m => new Date(m.date) >= new Date()).length },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {clubAnnouncements.slice(0, 3).map(ann => (
              <div key={ann.id} className="bg-white border border-gray-200 p-3 rounded-lg">
                <p className="font-medium text-gray-800">{ann.title}</p>
                <p className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Upcoming Meetings</h3>
          <div className="space-y-3">
            {clubMeetings.filter(m => new Date(m.date) >= new Date()).slice(0, 3).map(meet => (
              <div key={meet.id} className="bg-white border border-gray-200 p-3 rounded-lg">
                <p className="font-medium text-gray-800">{meet.title}</p>
                <p className="text-xs text-gray-500">{new Date(meet.date).toLocaleDateString()} at {meet.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Members ({clubMembers.length})</h2>
        <button onClick={() => { setEditingMember(null); setIsMemberModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" /><span>Add Member</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Email</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubMembers.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-4">{member.userName}</td>
                <td className="py-3 px-4 text-gray-600">{member.userEmail}</td>
                <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{member.status}</span></td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditingMember(member); setIsMemberModalOpen(true); }} className="p-1 text-gray-600 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => openDeleteModal(member.id, 'member')} className="p-1 text-gray-600 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <button onClick={() => { setEditingAnnouncement(null); setIsAnnouncementModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" /><span>New Announcement</span>
        </button>
      </div>
      <div className="space-y-4">
        {clubAnnouncements.map(ann => (
          <div key={ann.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <p className="font-bold">{ann.title}</p>
              <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
              <div className="text-xs text-gray-500 mt-2">
                <span>{new Date(ann.createdAt).toLocaleString()} | Priority: </span>
                <span className={`font-medium ${ann.priority === 'high' ? 'text-red-600' : ann.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{ann.priority}</span>
              </div>
            </div>
            <div className="flex space-x-2 flex-shrink-0 ml-4">
              <button onClick={() => { setEditingAnnouncement(ann); setIsAnnouncementModalOpen(true); }} className="p-1 text-gray-600 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => openDeleteModal(ann.id, 'announcement')} className="p-1 text-gray-600 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeetings = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Meetings & Events</h2>
        <button onClick={() => { setEditingMeeting(null); setIsMeetingModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" /><span>Schedule Event</span>
        </button>
      </div>
      <div className="space-y-4">
        {clubMeetings.map(meet => (
          <div key={meet.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <p className="font-bold">{meet.title} <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full ml-2">{meet.type}</span></p>
              <p className="text-sm text-gray-600 mt-1">{meet.description}</p>
              <p className="text-sm font-medium text-gray-800 mt-2">{new Date(meet.date).toLocaleDateString()} at {meet.time} - {meet.location}</p>
            </div>
            <div className="flex space-x-2 flex-shrink-0 ml-4">
              <button onClick={() => { setEditingMeeting(meet); setIsMeetingModalOpen(true); }} className="p-1 text-gray-600 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => openDeleteModal(meet.id, 'meeting')} className="p-1 text-gray-600 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettingsFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettingsFormState(prev => ({ ...prev, isRecruiting: e.target.checked }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveClubSettings(settingsFormState);
    };

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Club Settings</h2>
        <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Club Name</label>
            <input type="text" name="name" value={settingsFormState.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={settingsFormState.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"/>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Recruiting new members</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isRecruiting" checked={settingsFormState.isRecruiting} onChange={handleToggleChange} className="sr-only peer"/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="pt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
        <div className="mt-12 pt-8 border-t border-red-200 max-w-2xl">
            <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
            <div className="mt-4 p-4 border border-red-300 rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-medium">Delete this club</p>
                    <p className="text-sm text-gray-600">Once deleted, this is irreversible.</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete Club</button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="leader" userName="Rahul" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <select value={selectedClub.id} onChange={(e) => setSelectedClub(clubs.find(c => c.id === e.target.value) || clubs[0])} className="w-full md:w-auto px-4 py-2 border-none rounded-md text-xl font-bold focus:ring-2 focus:ring-blue-500">
            {clubs.map(club => (<option key={club.id} value={club.id}>{club.name}</option>))}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map(tab => (<button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-left rounded-md ${selectedTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><tab.icon className="h-5 w-5" /><span>{tab.label}</span></button>))}
              </nav>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div key={selectedTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {selectedTab === 'overview' && renderOverview()}
                  {selectedTab === 'members' && renderMembers()}
                  {selectedTab === 'announcements' && renderAnnouncements()}
                  {selectedTab === 'meetings' && renderMeetings()}
                  {selectedTab === 'settings' && renderSettings()}
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
    </div>
  );
};

export default LeaderDashboard;
