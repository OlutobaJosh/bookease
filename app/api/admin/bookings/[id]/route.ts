import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
type Status = (typeof VALID_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status as Status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
