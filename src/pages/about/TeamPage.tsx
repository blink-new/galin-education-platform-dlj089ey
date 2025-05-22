import React, { useState, useEffect } from 'react';
import TeamMemberCard from '../../components/TeamMemberCard';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { TeamMember } from '../../types/team';

const TeamPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
      return;
    }

    setTeamMembers(data || []);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'counselor', name: 'Counselors' },
    { id: 'coach', name: 'Coaches' },
    { id: 'tutor', name: 'Tutors' }
  ];

  const filteredMembers = selectedCategory === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals who make Galin Education a leader in educational excellence.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12 space-x-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading team members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members found in this category.</p>
          </div>
        ) : (
          /* Team Grid */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            layout
          >
            {filteredMembers.map(member => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                title={member.title}
                image_url={member.image_url}
                degrees={member.degrees}
                bio={member.bio}
                category={member.category}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;