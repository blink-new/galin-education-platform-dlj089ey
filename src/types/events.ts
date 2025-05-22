export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'info-session';
  price?: number;
  max_participants?: number | null;
  zoom_webinar_id?: string | null;
  created_at: string;
  updated_at: string;
  registrations?: Array<{ count: number }>;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  stripe_payment_id?: string;
  zoom_registrant_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'awaiting_payment';
  created_at: string;
  updated_at: string;
}