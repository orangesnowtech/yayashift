import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Get submission details first to get file URLs
    const submissionRef = doc(db, 'submissions', id);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const submission = submissionSnap.data();

    // Delete files from Storage
    try {
      // Extract file paths from URLs
      if (submission.auditionVideoUrl) {
        const videoPath = extractPathFromUrl(submission.auditionVideoUrl);
        if (videoPath) {
          const videoRef = ref(storage, videoPath);
          await deleteObject(videoRef).catch(err => 
            console.warn('Video file not found or already deleted:', err)
          );
        }
      }

      if (submission.paymentProofUrl) {
        const paymentPath = extractPathFromUrl(submission.paymentProofUrl);
        if (paymentPath) {
          const paymentRef = ref(storage, paymentPath);
          await deleteObject(paymentRef).catch(err => 
            console.warn('Payment file not found or already deleted:', err)
          );
        }
      }
    } catch (storageError) {
      console.error('Error deleting storage files:', storageError);
      // Continue with Firestore deletion even if storage deletion fails
    }

    // Delete Firestore document
    await deleteDoc(submissionRef);

    console.log(`✅ Successfully deleted submission ${id} and associated files`);

    return NextResponse.json({
      success: true,
      message: 'Submission and associated files deleted successfully',
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Extract storage path from Firebase Storage URL
 */
function extractPathFromUrl(url: string): string | null {
  try {
    // Firebase Storage URL format: 
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?...
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
    return null;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}
