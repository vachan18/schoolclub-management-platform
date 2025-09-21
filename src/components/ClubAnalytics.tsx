import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClubMember, MeetingSchedule } from '../types';
import { motion } from 'framer-motion';

interface ClubAnalyticsProps {
    members: ClubMember[];
    meetings: MeetingSchedule[];
}

const memberStatusData = (members: ClubMember[]) => [
    { name: 'Active', value: members.filter(m => m.status === 'active').length },
    { name: 'Pending', value: members.filter(m => m.status === 'pending').length },
    { name: 'Inactive', value: members.filter(m => m.status === 'inactive').length },
];

const memberGrowthData = [
    { name: 'Jan', members: 12 },
    { name: 'Feb', members: 19 },
    { name: 'Mar', members: 25 },
    { name: 'Apr', members: 33 },
    { name: 'May', members: 42 },
];

const COLORS = {
    'Active': '#10B981', // green-500
    'Pending': '#F59E0B', // amber-500
    'Inactive': '#6B7280', // gray-500
};

const ClubAnalytics: React.FC<ClubAnalyticsProps> = ({ members, meetings }) => {
    const statusData = memberStatusData(members);
    const upcomingEvents = meetings.filter(m => new Date(m.date) >= new Date()).length;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Club Analytics</h2>
            
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: 'Total Members', value: members.length },
                    { label: 'Active Members', value: statusData.find(s => s.name === 'Active')?.value || 0 },
                    { label: 'Pending Requests', value: statusData.find(s => s.name === 'Pending')?.value || 0 },
                    { label: 'Upcoming Events', value: upcomingEvents },
                ].map(stat => (
                    <motion.div key={stat.label} variants={cardVariants} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Member Growth (YTD)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={memberGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="rgb(107 114 128)" fontSize={12} />
                                <YAxis stroke="rgb(107 114 128)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        border: '1px solid #ccc',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                                <Bar dataKey="members" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Member Status</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubAnalytics;
