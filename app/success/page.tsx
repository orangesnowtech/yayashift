'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            Submission Successful! 🎉
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for submitting your audition for the Favoured Family Regional Shift Competition!
          </p>

          {/* Submission ID */}
          {submissionId && (
            <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6 text-left">
              <p className="text-sm font-medium text-green-800 mb-1">Submission ID:</p>
              <p className="text-lg font-mono text-green-900">{submissionId}</p>
              <p className="text-sm text-green-700 mt-2">
                Please save this ID for your records.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6 text-left">
            <h2 className="font-semibold text-orange-800 mb-2">What&apos;s Next?</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-orange-600 font-bold mr-2">1.</span>
                <span>You will receive a confirmation email shortly at the address you provided.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 font-bold mr-2">2.</span>
                <span>Our team will review all submissions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 font-bold mr-2">3.</span>
                <span>15 participants will be selected for the semi-final on March 27, 2026.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 font-bold mr-2">4.</span>
                <span>You will be notified via email if you are selected.</span>
              </li>
            </ul>
          </div>

          {/* Event Reminder */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Event Schedule</h3>
            <p className="text-sm text-gray-600">
              <strong>Semi-Final:</strong> March 27, 2026<br />
              <strong>Final:</strong> March 28, 2026
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="inline-block bg-linear-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Back to Home
          </Link>

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mt-6">
            If you have any questions, please check your email for our contact information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
