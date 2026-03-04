import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { SendMailClient } from 'zeptomail';

/**
 * Generate a unique 6-character alphanumeric ID
 */
function generateFriendlyId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking chars (0,O,1,I)
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Check if friendly ID already exists in Firestore
 */
async function isIdUnique(friendlyId: string): Promise<boolean> {
  const q = query(collection(db, 'submissions'), where('friendlyId', '==', friendlyId));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

/**
 * Generate a unique friendly ID with collision checking
 */
async function generateUniqueFriendlyId(): Promise<string> {
  let friendlyId = generateFriendlyId();
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    if (await isIdUnique(friendlyId)) {
      return friendlyId;
    }
    friendlyId = generateFriendlyId();
    attempts++;
  }
  
  // If we still have collisions after 10 attempts, add timestamp
  return friendlyId + Date.now().toString().slice(-2);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract form fields
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      region,
      zone,
      area,
      province,
      parishName,
      parishPastorName,
      description,
      auditionVideoUrl,
      paymentProofUrl,
      submissionId,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !region ||
      zone === undefined ||
      zone === null ||
      area === undefined ||
      area === null ||
      !province ||
      !parishName ||
      !parishPastorName ||
      !description ||
      !auditionVideoUrl ||
      !paymentProofUrl ||
      !submissionId
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate unique friendly ID
    const friendlyId = await generateUniqueFriendlyId();
    console.log('Generated friendly ID:', friendlyId);

    // Save submission to Firestore
    const submissionData = {
      friendlyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      region,
      zone,
      area,
      province,
      parishName,
      parishPastorName,
      description,
      auditionVideoUrl,
      paymentProofUrl,
      submittedAt: serverTimestamp(),
      status: 'pending',
      notes: '',
    };

    const docRef = await addDoc(
      collection(db, 'submissions'),
      submissionData
    );

    // Send email notification directly
    try {
      console.log('Attempting to send confirmation email to:', email);
      
      const zeptomailApiKey = process.env.ZEPTOMAIL_API_KEY;
      const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
      const fromName = process.env.ZEPTOMAIL_FROM_NAME || 'Favoured Family Regional Shift Competition';

      if (zeptomailApiKey && fromEmail) {
        const url = 'https://api.zeptomail.com/v1.1/email';
        const client = new SendMailClient({ url, token: zeptomailApiKey });

        await client.sendMail({
          from: {
            address: fromEmail,
            name: fromName,
          },
          to: [
            {
              email_address: {
                address: email,
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
                  <p>Dear ${firstName} ${lastName},</p>
                  
                  <p><strong>Thank you for submitting your audition!</strong> We have successfully received your application for the Favoured Family Regional Shift Competition.</p>
                  
                  <div class="submission-id">
                    <strong>Your Submission ID:</strong><br>
                    <span style="font-size: 24px; letter-spacing: 2px; font-weight: bold;">${friendlyId}</span>
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

        console.log('✅ Confirmation email sent successfully to:', email);
      } else {
        console.error('Email configuration missing - skipping email');
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Continue even if email fails - submission was successful
    }

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        friendlyId: friendlyId,
        message: 'Submission successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during submission. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
