import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, firstName, lastName, submissionId } = await request.json();

    const zeptomailApiKey = process.env.ZEPTOMAIL_API_KEY;
    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
    const fromName = process.env.ZEPTOMAIL_FROM_NAME;

    if (!zeptomailApiKey || !fromEmail) {
      console.error('Zeptomail configuration missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const emailContent = {
      bounce_address: fromEmail,
      from: {
        address: fromEmail,
        name: fromName || 'Favoured Family Regional Shift Competition',
      },
      to: [
        {
          email_address: {
            address: to,
            name: `${firstName} ${lastName}`,
          },
        },
      ],
      subject: 'Audition Submission Confirmation - Favoured Family Regional Shift Competition',
      htmlbody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #16a34a, #ea580c);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .info-box {
              background: #f0fdf4;
              border-left: 4px solid #16a34a;
              padding: 15px;
              margin: 20px 0;
            }
            .submission-id {
              background: #fff7ed;
              border-left: 4px solid #ea580c;
              padding: 15px;
              margin: 20px 0;
              font-family: monospace;
              font-size: 16px;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 8px 8px;
              font-size: 14px;
              color: #6b7280;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎤 Audition Submission Received!</h1>
              <p style="margin: 10px 0 0 0;">Favoured Family Regional Shift Competition</p>
            </div>
            
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p><strong>Thank you for submitting your audition!</strong> We have successfully received your application for the Favoured Family Regional Shift Competition.</p>
              
              <div class="submission-id">
                <strong>Your Submission ID:</strong><br>
                ${submissionId}
              </div>
              
              <p>Please save this ID for your records. You may need it for future reference.</p>
              
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
    };

    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zeptomailApiKey,
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Zeptomail error:', errorData);
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
