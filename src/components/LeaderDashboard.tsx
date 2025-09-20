import React, { useState } from 'react';
import { Plus, Users, Calendar, Bell, Settings, BarChart3, Edit3, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockClubs, mockClubMembers, mockAnnouncements, mockMeetingSchedules } from '../data/mockData';
import Header from './Header';

const LeaderDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedClub, setSelectedClub] = useState(mockClubs[0]);

  const clubMembers = mockClubMembers.filter(member => member.clubId === selectedClub.id);
  const clubAnnouncements = mockAnnouncements.filter(ann => ann.clubId === selectedClub.id);
  const clubMeetings = mockMeetingSchedules.filter(meeting => meeting.clubId === selectedClub.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Members', value: clubMembers.length, change: '+12%', positive: true },
    { label: 'Active Members', value: clubMembers.filter(m => m.status === 'active').length, change: '+5%', positive: true },
    { label: 'Pending Requests', value: clubMembers.filter(m => m.status === 'pending').length, change: '+3', positive: true },
    { label: 'Upcoming Events', value: clubMeetings.length, change: '2 this week', positive: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="leader" userName="Sarah Johnson" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Club Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedClub.name}</h1>
                <p className="text-gray-600 mt-1">{selectedClub.description}</p>
              </div>
              <select
                value={selectedClub.id}
                onChange={(e) => setSelectedClub(mockClubs.find(club => club.id === e.target.value) || mockClubs[0])}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockClubs.slice(0, 5).map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                        selectedTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm">
              {selectedTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Club Overview</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm">New member joined</span>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm">Meeting scheduled</span>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm">Announcement posted</span>
                            <span className="text-xs text-gray-500">3 days ago</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                            <span>New Announcement</span>
                          </button>
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                            <Calendar className="h-4 w-4" />
                            <span>Schedule Meeting</span>
                          </button>
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                            <Users className="h-4 w-4" />
                            <span>Manage Members</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'members' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Members ({clubMembers.length})</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      <span>Add Member</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {clubMembers.slice(0, 10).map(member => (
                          <tr key={member.id}>
                            <td className="py-3 px-4">{member.userName}</td>
                            <td className="py-3 px-4 text-gray-600">{member.userEmail}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                member.status === 'active' ? 'bg-green-100 text-green-800' :
                                member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{new Date(member.joinedAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-700">
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedTab === 'announcements' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Announcements</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      <span>New Announcement</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {clubAnnouncements.slice(0, 5).map(announcement => (
                      <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">Edit</button>
                            <button className="text-red-600 hover:text-red-700">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'meetings' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Meetings & Events</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      <span>Schedule Meeting</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {clubMeetings.slice(0, 5).map(meeting => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            meeting.type === 'event' ? 'bg-purple-100 text-purple-800' :
                            meeting.type === 'workshop' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {meeting.type}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>📅 {meeting.date}</div>
                          <div>🕒 {meeting.time}</div>
                          <div>📍 {meeting.location}</div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Club Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                        <input
                          type="text"
                          value={selectedClub.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>{selectedClub.category}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={4}
                        value={selectedClub.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Schedule</label>
                        <input
                          type="text"
                          value={selectedClub.meetingSchedule}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={selectedClub.location}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedClub.isRecruiting}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Currently accepting new members
                      </label>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
