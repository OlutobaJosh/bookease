import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
};

export type Booking = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  services?: { name: string };
};
