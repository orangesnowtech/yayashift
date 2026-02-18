'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormData } from '@/lib/types';

export default function SubmitAudition() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [paymentPreview, setPaymentPreview] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    region: '',
    province: '',
    parishName: '',
    parishPastorName: '',
    description: '',
    auditionVideo: null,
    paymentProof: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (name === 'auditionVideo') {
        setVideoPreview(previewUrl);
      } else if (name === 'paymentProof') {
        setPaymentPreview(previewUrl);
      }
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.phoneNumber.trim()) return 'Phone number is required';
    if (!formData.region) return 'Region is required';
    if (!formData.province.trim()) return 'Province is required';
    if (!formData.parishName.trim()) return 'Parish name is required';
    if (!formData.parishPastorName.trim()) return 'Parish pastor name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.description.length < 50) return 'Description must be at least 50 characters';
    if (!formData.auditionVideo) return 'Audition video is required';
    if (!formData.paymentProof) return 'Payment proof is required';
    
    // Validate file types
    const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
    if (formData.auditionVideo && !videoTypes.includes(formData.auditionVideo.type)) {
      return 'Audition video must be MP4, MOV, or AVI format';
    }
    
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (formData.paymentProof && !imageTypes.includes(formData.paymentProof.type)) {
      return 'Payment proof must be JPG, PNG, or PDF format';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to submit? You will not be able to edit your submission after submitting.'
    );
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('region', formData.region);
      formDataToSend.append('province', formData.province);
      formDataToSend.append('parishName', formData.parishName);
      formDataToSend.append('parishPastorName', formData.parishPastorName);
      formDataToSend.append('description', formData.description);
      
      if (formData.auditionVideo) {
        formDataToSend.append('auditionVideo', formData.auditionVideo);
      }
      if (formData.paymentProof) {
        formDataToSend.append('paymentProof', formData.paymentProof);
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Success - redirect to success page
      router.push(`/success?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Submit Your Audition</h1>
              <p className="text-green-100 mt-1">Favoured Family Regional Shift Competition</p>
            </div>
            <Link
              href="/"
              className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Warning Message */}
          <div className="bg-orange-100 border-l-4 border-orange-600 text-orange-800 p-4 mb-6 rounded">
            <p className="font-semibold">⚠️ Important Notice</p>
            <p className="text-sm mt-1">
              Please ensure all information is accurate. You will NOT be able to edit your submission after submitting.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mb-6 rounded">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Church Information */}
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                  Church Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Region</option>
                      <option value="Region 20">Region 20</option>
                      <option value="Region 51">Region 51</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parish Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="parishName"
                      value={formData.parishName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parish Pastor Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="parishPastorName"
                      value={formData.parishPastorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                  About Your Audition
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tell us about yourself and why you&apos;re auditioning <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Minimum 50 characters..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length} characters (minimum 50)
                  </p>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                  Upload Files
                </h2>
                
                {/* Audition Video */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audition Video <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    name="auditionVideo"
                    onChange={handleFileChange}
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: MP4, MOV, AVI (Max 500MB)
                  </p>
                  {videoPreview && (
                    <div className="mt-2">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-w-md rounded-lg border-2 border-green-200"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Proof <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    name="paymentProof"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, PDF (Max 10MB)
                  </p>
                  {paymentPreview && formData.paymentProof?.type.startsWith('image/') && (
                    <div className="mt-2">
                      <img
                        src={paymentPreview}
                        alt="Payment proof preview"
                        className="w-full max-w-md rounded-lg border-2 border-green-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Audition'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
