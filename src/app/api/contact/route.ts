import { NextResponse } from 'next/server';
import { ContactMessage } from '@/models';
import { sendContactUserConfirmation, sendContactAdminNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim();
    const studyPreference = (body.subject || body.studyPreference || "General Inquiry").trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      studyPreference,
      message,
      status: "UNREAD",
      createdAt: new Date(),
    } as any);

    // Send email notifications (non-blocking)
    Promise.all([
      sendContactUserConfirmation(email),
      sendContactAdminNotification({ name, email, studyPreference, message })
    ]).catch(err => console.error("Failed to send contact emails", err));

    return NextResponse.json({ success: true, contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your message.' },
      { status: 500 }
    );
  }
}
