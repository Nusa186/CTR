import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const [requestId, approver] = Buffer.from(token, 'base64').toString().split(':');

    // Update the request status in Supabase
    const { data, error } = await supabase
      .from('tree_cutting_requests')
      .update({ 
        status: 'approved',
        approved_by: approver,
        approved_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select();

    if (error) {
      throw error;
    }

    // Redirect to a success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/approval-success`);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}