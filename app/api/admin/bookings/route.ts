import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Middleware already protects this route.
export async function GET() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
