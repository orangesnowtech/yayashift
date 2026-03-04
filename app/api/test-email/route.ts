import { NextRequest, NextResponse } from 'next/server';
import { SendMailClient } from 'zeptomail';

/**
 * Test endpoint to verify email configuration
 * Access: /api/test-email
 */
export async function GET(request: NextRequest) {
  try {
    console.log('=== Email Configuration Test ===');
    
    // Check environment variables
    const zeptomailApiKey = process.env.ZEPTOMAIL_API_KEY;
    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
    const fromName = process.env.ZEPTOMAIL_FROM_NAME;

    const config = {
      apiKeyPresent: !!zeptomailApiKey,
      apiKeyLength: zeptomailApiKey?.length || 0,
      apiKeyPrefix: zeptomailApiKey?.substring(0, 20) + '...',
      fromEmail: fromEmail || 'NOT SET',
      fromName: fromName || 'NOT SET',
    };

    console.log('Configuration:', config);

    if (!zeptomailApiKey || !fromEmail) {
      return NextResponse.json({
        status: 'error',
        message: 'Email service not properly configured',
        config,
        missing: [
          !zeptomailApiKey && 'ZEPTOMAIL_API_KEY',
          !fromEmail && 'ZEPTOMAIL_FROM_EMAIL',
        ].filter(Boolean),
      });
    }

    // Try to initialize the client
    try {
      const url = 'https://api.zeptomail.com/v1.1/email';
      const client = new SendMailClient({ url, token: zeptomailApiKey });
      
      return NextResponse.json({
        status: 'success',
        message: 'Email service is properly configured',
        config,
        note: 'ZeptoMail client initialized successfully. To send a test email, use POST method with recipient email.',
      });
    } catch (initError) {
      console.error('Client initialization error:', initError);
      return NextResponse.json({
        status: 'error',
        message: 'Failed to initialize email client',
        config,
        error: initError instanceof Error ? initError.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Send a test email
 * POST with body: { "email": "test@example.com" }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required in request body' },
        { status: 400 }
      );
    }

    console.log('=== Sending Test Email ===');
    console.log('Recipient:', email);

    const zeptomailApiKey = process.env.ZEPTOMAIL_API_KEY;
    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
    const fromName = process.env.ZEPTOMAIL_FROM_NAME || 'Test Sender';

    if (!zeptomailApiKey || !fromEmail) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const url = 'https://api.zeptomail.com/v1.1/email';
    const client = new SendMailClient({ url, token: zeptomailApiKey });

    const result = await client.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: email,
            name: 'Test Recipient',
          },
        },
      ],
      subject: 'Test Email from Yaya Shift Competition',
      htmlbody: `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email sent at ${new Date().toISOString()}</p>
          <p>If you received this, the email service is working correctly!</p>
        </body>
        </html>
      `,
    });

    console.log('✅ Test email sent successfully');
    console.log('Result:', result);

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      result,
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
