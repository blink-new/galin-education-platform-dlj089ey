import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@13.9.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, userId } = await req.json();

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    // Create Stripe payment intent if event has a price
    let paymentIntent = null;
    if (event.price > 0) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(event.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          eventId,
          userId,
        },
      });
    }

    // Register for Zoom webinar if webinar ID exists
    let zoomRegistration = null;
    if (event.zoom_webinar_id) {
      const zoomResponse = await fetch(
        `https://api.zoom.us/v2/webinars/${event.zoom_webinar_id}/registrants`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('ZOOM_JWT_TOKEN')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userId, // You'll need to get the user's email from auth.users
            first_name: 'Participant', // You'll need to get these from user profile
            last_name: '',
          }),
        }
      );

      if (!zoomResponse.ok) {
        throw new Error('Failed to register for Zoom webinar');
      }

      zoomRegistration = await zoomResponse.json();
    }

    // Create registration record
    const { data: registration, error: registrationError } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          stripe_payment_id: paymentIntent?.id,
          zoom_registrant_id: zoomRegistration?.registrant_id,
          status: event.price > 0 ? 'awaiting_payment' : 'confirmed',
        },
      ])
      .select()
      .single();

    if (registrationError) {
      throw new Error('Failed to create registration');
    }

    return new Response(
      JSON.stringify({
        registration,
        paymentIntent: paymentIntent ? {
          clientSecret: paymentIntent.client_secret,
        } : null,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});