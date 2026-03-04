import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SendMailClient } from 'zeptomail';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Get submission details
    const submissionRef = doc(db, 'submissions', id);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const submission = submissionSnap.data();

    // Validate email environment variables
    const apiKey = process.env.ZEPTOMAIL_API_KEY;
    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
    const fromName = process.env.ZEPTOMAIL_FROM_NAME;

    if (!apiKey || !fromEmail || !fromName) {
      console.error('❌ Missing email configuration');
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    console.log('📧 Resending email to:', submission.email);
    console.log('📧 From:', fromEmail);

    // Send email using ZeptoMail
    const client = new SendMailClient({ url: 'api.zeptomail.com/', token: apiKey });

    const emailResponse = await client.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: submission.email,
            name: submission.fullName,
          },
        },
      ],
      subject: 'YAYASHIFT 2025 - Application Received',
      htmlbody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Received!</h2>
          <p>Dear ${submission.fullName},</p>
          <p>Thank you for submitting your application to YAYASHIFT 2025!</p>
          <p>We have successfully received your audition video and payment proof.</p>
          <p><strong>Submission Details:</strong></p>
          <ul>
            <li>Full Name: ${submission.fullName}</li>
            <li>Email: ${submission.email}</li>
            <li>Phone: ${submission.phoneNumber}</li>
            <li>Location: ${submission.location}</li>
            <li>Instagram: @${submission.instagramHandle}</li>
            <li>Submitted: ${new Date(submission.createdAt.seconds * 1000).toLocaleDateString()}</li>
          </ul>
          <p>Our team will review your application and get back to you soon.</p>
          <p>Best regards,<br>The YAYASHIFT Team</p>
        </div>
      `,
    });

    console.log('✅ Email resend successful:', emailResponse);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailResponse,
    });
  } catch (error) {
    console.error('❌ Resend email error:', error);
    return NextResponse.json(
      {
        error: 'Failed to resend email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
