import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Event } from '../../types/events';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

const EventsAdminPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  };

  const handleCreateEvent = () => {
    setEditingEvent({
      id: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      type: 'workshop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0]
    });
  };

  const handleSaveEvent = async () => {
    if (!editingEvent) return;

    const isNewEvent = !editingEvent.id;
    const { data, error } = isNewEvent
      ? await supabase
          .from('events')
          .insert([editingEvent])
          .select()
          .single()
      : await supabase
          .from('events')
          .update(editingEvent)
          .eq('id', editingEvent.id)
          .select()
          .single();

    if (error) {
      console.error('Error saving event:', error);
      return;
    }

    fetchEvents();
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return;
    }

    fetchEvents();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <button
          onClick={handleCreateEvent}
          className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Event
        </button>
      </div>

      {/* Event Editor Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingEvent.id ? 'Edit Event' : 'New Event'}
              </h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 2:00 PM - 4:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={editingEvent.type}
                  onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as Event['type'] })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="info-session">Info Session</option>
                </select>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveEvent}
                  className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    event.type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'seminar' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
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

export default EventsAdminPage;