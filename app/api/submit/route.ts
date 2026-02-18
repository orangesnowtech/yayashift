import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const region = formData.get('region') as string;
    const province = formData.get('province') as string;
    const parishName = formData.get('parishName') as string;
    const parishPastorName = formData.get('parishPastorName') as string;
    const description = formData.get('description') as string;
    const auditionVideo = formData.get('auditionVideo') as File;
    const paymentProof = formData.get('paymentProof') as File;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !region ||
      !province ||
      !parishName ||
      !parishPastorName ||
      !description ||
      !auditionVideo ||
      !paymentProof
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Upload files to Firebase Storage
    const submissionId = uuidv4();

    // Upload audition video
    const videoExtension = auditionVideo.name.split('.').pop();
    const videoRef = ref(
      storage,
      `auditions/${submissionId}/video.${videoExtension}`
    );
    const videoBuffer = await auditionVideo.arrayBuffer();
    await uploadBytes(videoRef, videoBuffer, {
      contentType: auditionVideo.type,
    });
    const auditionVideoUrl = await getDownloadURL(videoRef);

    // Upload payment proof
    const paymentExtension = paymentProof.name.split('.').pop();
    const paymentRef = ref(
      storage,
      `auditions/${submissionId}/payment.${paymentExtension}`
    );
    const paymentBuffer = await paymentProof.arrayBuffer();
    await uploadBytes(paymentRef, paymentBuffer, {
      contentType: paymentProof.type,
    });
    const paymentProofUrl = await getDownloadURL(paymentRef);

    // Save submission to Firestore
    const submissionData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      region,
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
      await fetch(`${request.nextUrl.origin}/api/send-email`, {
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
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
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
