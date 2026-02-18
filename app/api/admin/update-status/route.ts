import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Submission ID and status are required' },
        { status: 400 }
      );
    }

    const submissionRef = doc(db, 'submissions', id);
    await updateDoc(submissionRef, {
      status,
      ...(notes && { notes }),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      {
        error: 'Failed to update status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
