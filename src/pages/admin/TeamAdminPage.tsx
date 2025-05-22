import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TeamMember } from '../../types/team';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

const TeamAdminPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newDegree, setNewDegree] = useState('');

  const categories = [
    { id: 'leadership', name: 'Leadership' },
    { id: 'counselor', name: 'Counselor' },
    { id: 'coach', name: 'Coach' },
    { id: 'tutor', name: 'Tutor' }
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching team members:', error);
      return;
    }

    setMembers(data || []);
    setLoading(false);
  };

  const handleCreateMember = () => {
    setEditingMember({
      id: '',
      name: '',
      title: '',
      image_url: '',
      degrees: [],
      bio: '',
      category: 'leadership',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    const isNewMember = !editingMember.id;
    const { data, error } = isNewMember
      ? await supabase
          .from('team_members')
          .insert([editingMember])
          .select()
          .single()
      : await supabase
          .from('team_members')
          .update(editingMember)
          .eq('id', editingMember.id)
          .select()
          .single();

    if (error) {
      console.error('Error saving team member:', error);
      return;
    }

    fetchMembers();
    setEditingMember(null);
  };

  const handleDeleteMember = async (id: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      return;
    }

    fetchMembers();
  };

  const handleAddDegree = () => {
    if (!editingMember || !newDegree.trim()) return;
    setEditingMember({
      ...editingMember,
      degrees: [...editingMember.degrees, newDegree.trim()]
    });
    setNewDegree('');
  };

  const handleRemoveDegree = (index: number) => {
    if (!editingMember) return;
    const newDegrees = [...editingMember.degrees];
    newDegrees.splice(index, 1);
    setEditingMember({
      ...editingMember,
      degrees: newDegrees
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <button
          onClick={handleCreateMember}
          className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Team Member
        </button>
      </div>

      {/* Team Member Editor Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingMember.id ? 'Edit Team Member' : 'New Team Member'}
              </h2>
              <button
                onClick={() => setEditingMember(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingMember.title}
                  onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingMember.image_url}
                  onChange={(e) => setEditingMember({ ...editingMember, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degrees
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingMember.degrees.map((degree, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
                    >
                      {degree}
                      <button
                        onClick={() => handleRemoveDegree(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDegree}
                    onChange={(e) => setNewDegree(e.target.value)}
                    className="flex-grow px-3 py-2 border rounded-md"
                    placeholder="Add a degree..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDegree();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddDegree}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingMember.category}
                  onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as TeamMember['category'] })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveMember}
                  className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
                  <p className="text-[#0085c2] font-medium mb-2">{member.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.degrees.map((degree, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {degree}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamAdminPage;