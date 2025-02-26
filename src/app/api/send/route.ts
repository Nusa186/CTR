import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { EmailTemplate } from '../../../components/email-template';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.VITE_RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestData, approvers } = body;

    // Send email to each approver
    for (const approver of approvers) {
      const approvalToken = Buffer.from(`${requestData.id}:${approver}`).toString('base64');
      const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/approve?token=${approvalToken}`;

      await resend.emails.send({
        from: 'Tree Cutting Request <onboarding@resend.dev>',
        to: [approver],
        subject: `Tree Cutting Request Approval - ${requestData.title}`,
        react: EmailTemplate({ 
          requestData,
          approvalUrl,
          approver 
        }) as React.ReactElement,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}