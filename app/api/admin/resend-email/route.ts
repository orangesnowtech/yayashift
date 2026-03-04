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
            name: `${submission.firstName} ${submission.lastName}`,
          },
        },
      ],
      subject: 'Audition Submission Confirmation - Favoured Family Regional Shift Competition',
      htmlbody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #16a34a, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .info-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; }
            .submission-id { background: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; font-family: monospace; font-size: 16px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎤 Audition Submission Received!</h1>
              <p style="margin: 10px 0 0 0;">Favoured Family Regional Shift Competition</p>
            </div>
            
            <div class="content">
              <p>Dear ${submission.firstName} ${submission.lastName},</p>
              
              <p><strong>Thank you for submitting your audition!</strong> We have successfully received your application for the Favoured Family Regional Shift Competition.</p>
              
              <div class="submission-id">
                <strong>Your Submission ID:</strong><br>
                <span style="font-size: 24px; letter-spacing: 2px; font-weight: bold;">${submission.friendlyId || 'N/A'}</span>
              </div>
              
              <p>Please save this ID for your records. You may need it for future reference or inquiries about your submission.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #16a34a;">What Happens Next?</h3>
                <ul>
                  <li>Our panel will carefully review all audition submissions</li>
                  <li>15 participants will be selected for the semi-final</li>
                  <li>Selected participants will be notified via email</li>
                  <li>You will receive updates on your submission status</li>
                </ul>
              </div>
              
              <div class="info-box" style="background: #fff7ed; border-left-color: #ea580c;">
                <h3 style="margin-top: 0; color: #ea580c;">Event Schedule</h3>
                <p style="margin: 5px 0;"><strong>Semi-Final:</strong> March 27, 2026 (15 participants)</p>
                <p style="margin: 5px 0;"><strong>Final:</strong> March 28, 2026 (6 finalists)</p>
              </div>
              
              <p><strong>Important:</strong> Please note that you cannot edit your submission after it has been submitted. If you have any concerns or need to update critical information, please contact us immediately.</p>
              
              <p>We appreciate your participation and look forward to reviewing your audition!</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The Favoured Family Regional Shift Competition Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; 2026 Favoured Family Regional Shift Competition. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
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
