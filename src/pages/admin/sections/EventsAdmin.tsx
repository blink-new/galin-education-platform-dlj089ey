import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Event } from '../../../types/events';
import { PlusCircle, Edit, Trash2, Save, X, DollarSign, Users, MapPin } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

const EventsAdmin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations:event_registrations(count)
      `)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
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
      price: 0,
      max_participants: null,
      zoom_webinar_id: '',
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

    // Validate required fields
    if (!editingEvent.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingEvent.date) {
      toast({
        title: "Validation Error",
        description: "Date is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingEvent.time.trim()) {
      toast({
        title: "Validation Error",
        description: "Time is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingEvent.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const isNewEvent = !editingEvent.id;
      let result;
      
      if (isNewEvent) {
        // For new events, remove the id property since Supabase will generate one
        const { id, created_at, updated_at, registrations, ...eventData } = editingEvent;
        result = await supabase
          .from('events')
          .insert([{ 
            ...eventData, 
            updated_at: new Date().toISOString() 
          }])
          .select()
          .single();
      } else {
        // For existing events, update with the current timestamp
        const { registrations, ...eventToUpdate } = editingEvent;
        result = await supabase
          .from('events')
          .update({ 
            ...eventToUpdate, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', editingEvent.id)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isNewEvent ? "Event created" : "Event updated",
        description: `Successfully ${isNewEvent ? 'created' : 'updated'} event: ${editingEvent.title}`,
      });

      // Update local state with the new/updated event
      if (isNewEvent) {
        setEvents([...events, result.data]);
      } else {
        setEvents(events.map(e => e.id === result.data.id ? {...result.data, registrations: e.registrations} : e));
      }
      
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: `Failed to save event: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Event deleted",
        description: "Successfully deleted event",
      });

      // Update local state by filtering out the deleted event
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getEventTypeStyles = (type: Event['type']) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'seminar':
        return 'bg-green-100 text-green-800';
      case 'info-session':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Manage Events</h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  Title *
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 2:00 PM - 4:00 PM"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={editingEvent.type}
                  onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as Event['type'] })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="info-session">Info Session</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingEvent.price}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEvent.max_participants || ''}
                    onChange={(e) => setEditingEvent({ 
                      ...editingEvent, 
                      max_participants: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom Webinar ID
                </label>
                <input
                  type="text"
                  value={editingEvent.zoom_webinar_id || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, zoom_webinar_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Optional - For virtual events"
                />
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

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No events found. Create your first event!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getEventTypeStyles(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    {event.price === 0 && (
                      <span className="px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        FREE
                      </span>
                    )}
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>
                          {event.registrations?.[0]?.count || 0}/{event.max_participants} spots filled
                        </span>
                      </div>
                    )}
                    {event.zoom_webinar_id && (
                      <span className="text-blue-600">Virtual Event</span>
                    )}
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
      )}
    </div>
  );
};

export default EventsAdmin;