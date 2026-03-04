import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    // Save submission to Firestore
    const submissionData = {
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

    // Send email notification
    try {
      console.log('Attempting to send confirmation email to:', email);
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          firstName,
          lastName,
          submissionId: docRef.id,
        }),
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.json();
        console.error('Email API returned error:', emailError);
      } else {
        console.log('Email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Email sending failed with exception:', emailError);
      // Continue even if email fails - submission was successful
    }

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
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
