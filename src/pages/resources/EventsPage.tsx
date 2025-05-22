import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types/events';

const EventsPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { session } = useAuth();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

  const handleRegister = async (event: Event) => {
    if (!session) {
      alert('Please log in to register for events');
      return;
    }

    setSelectedEvent(event);
    setRegistering(true);

    try {
      if (event.max_participants && 
          event.registrations?.[0]?.count && 
          event.registrations[0].count >= event.max_participants) {
        throw new Error('Event is full');
      }

      // Create a registration record
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert([
          { 
            event_id: event.id, 
            user_id: session.user.id,
            status: event.price && event.price > 0 ? 'awaiting_payment' : 'confirmed'
          }
        ]);

      if (registrationError) {
        throw new Error(registrationError.message);
      }

      // If the event is free, we're done
      if (!event.price || event.price === 0) {
        alert('Registration successful!');
        fetchEvents(); // Refresh the events to update registration counts
      } else {
        // For paid events, we'd redirect to payment processing
        // This is a placeholder for the Stripe integration
        alert('You will be redirected to payment processing (not implemented yet)');
      }
    } catch (error) {
      alert(error.message || 'Failed to register');
    } finally {
      setRegistering(false);
      setSelectedEvent(null);
    }
  };

  const getButtonText = (event: Event, isRegistering: boolean) => {
    if (isRegistering && selectedEvent?.id === event.id) {
      return 'Processing...';
    }
    if (event.max_participants && 
        event.registrations?.[0]?.count && 
        event.registrations[0].count >= event.max_participants) {
      return 'Sold Out';
    }
    return 'Register Now';
  };

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Upcoming Events</h1>

        {/* Featured Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No upcoming events scheduled. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEventTypeStyles(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        {event.price === 0 && (
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            FREE
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                        </div>
                        {event.max_participants && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
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
                    <div className="w-full lg:w-auto flex justify-end mt-4 lg:mt-0">
                      <button
                        onClick={() => handleRegister(event)}
                        disabled={
                          registering && selectedEvent?.id === event.id || 
                          (event.max_participants && event.registrations?.[0]?.count && 
                           event.registrations[0].count >= event.max_participants)
                        }
                        className={`w-full lg:w-[120px] h-10 flex items-center justify-center px-6 rounded-md font-medium text-white transition-colors whitespace-nowrap ${
                          registering && selectedEvent?.id === event.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : event.max_participants && event.registrations?.[0]?.count && 
                              event.registrations[0].count >= event.max_participants
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#0085c2] hover:bg-[#FFB546]'
                        }`}
                      >
                        {getButtonText(event, registering)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Events Calendar</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ←
              </button>
              <h3 className="text-lg font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
            {calendarDays.map(day => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div
                  key={day.toString()}
                  className={`
                    min-h-[80px] p-2 border rounded-md relative
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                    ${isSelected ? 'border-[#0085c2]' : 'border-gray-200'}
                    ${isToday(day) ? 'bg-blue-50' : ''}
                    cursor-pointer hover:border-[#0085c2]
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className={`
                    text-sm
                    ${!isCurrentMonth && 'text-gray-400'}
                    ${isToday(day) && 'font-bold text-blue-600'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 mt-1 rounded
                        ${getEventTypeStyles(event.type)}
                        truncate
                      `}
                      title={event.title}
                    >
                      {event.title}
                      {event.price === 0 && ' (Free)'}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
              </h4>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg mb-1">{event.title}</div>
                          <div className="text-sm text-gray-600">{event.time}</div>
                          <div className="text-sm text-gray-600 mt-1">{event.location}</div>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeStyles(event.type)}`}>
                              {event.type}
                            </span>
                            {event.price === 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                FREE
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events scheduled for this date.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;