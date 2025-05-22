import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Calendar, Users } from 'lucide-react';
import BlogAdmin from './sections/BlogAdmin';
import EventsAdmin from './sections/EventsAdmin';
import TeamAdmin from './sections/TeamAdmin';

type Section = 'blog' | 'events' | 'team';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('blog');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const sections = [
    { id: 'blog' as Section, name: 'Blog Posts', icon: BookOpen },
    { id: 'events' as Section, name: 'Events', icon: Calendar },
    { id: 'team' as Section, name: 'Team Members', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          {sections.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === id
                  ? 'bg-[#0085c2] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeSection === 'blog' && <BlogAdmin />}
          {activeSection === 'events' && <EventsAdmin />}
          {activeSection === 'team' && <TeamAdmin />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;