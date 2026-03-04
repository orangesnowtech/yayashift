'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { FormData } from '@/lib/types';

export default function SubmitAudition() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'network' | 'storage' | 'file-size' | 'permission' | 'generic' | ''>('');
  const [canRetry, setCanRetry] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [paymentPreview, setPaymentPreview] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    region: '',
    zone: '',
    area: '',
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file size immediately
      const maxVideoSize = 500 * 1024 * 1024; // 500MB
      const maxPaymentSize = 10 * 1024 * 1024; // 10MB
      
      if (name === 'auditionVideo' && file.size > maxVideoSize) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        setError(`Video file is too large (${sizeMB}MB). Maximum size is 500MB. Please compress your video or use a shorter clip.`);
        setErrorType('file-size');
        e.target.value = ''; // Clear the input
        return;
      }
      
      if (name === 'paymentProof' && file.size > maxPaymentSize) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        setError(`Payment proof file is too large (${sizeMB}MB). Maximum size is 10MB. Please compress or resize the image.`);
        setErrorType('file-size');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Clear any previous errors if file is valid
      if (error && errorType === 'file-size') {
        setError('');
        setErrorType('');
      }
      
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
    if (!formData.zone.trim()) return 'Zone is required';
    if (!/^\d+$/.test(formData.zone)) return 'Zone must be a valid number';
    if (!formData.area.trim()) return 'Area is required';
    if (!/^\d+$/.test(formData.area)) return 'Area must be a valid number';
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

    // Validate file sizes
    const maxVideoSize = 500 * 1024 * 1024; // 500MB
    const maxPaymentSize = 10 * 1024 * 1024; // 10MB
    
    if (formData.auditionVideo && formData.auditionVideo.size > maxVideoSize) {
      const sizeMB = Math.round(formData.auditionVideo.size / (1024 * 1024));
      return `Audition video is too large (${sizeMB}MB). Maximum size is 500MB. Please compress your video or use a shorter clip.`;
    }
    
    if (formData.paymentProof && formData.paymentProof.size > maxPaymentSize) {
      const sizeMB = Math.round(formData.paymentProof.size / (1024 * 1024));
      return `Payment proof is too large (${sizeMB}MB). Maximum size is 10MB. Please compress or resize the image.`;
    }

    return null;
  };

  const uploadFileToStorage = async (
    file: File,
    path: string,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress(progress);
        },
        (error) => {
          // Create detailed error with type information
          interface EnhancedError extends Error {
            type?: string;
            canRetry?: boolean;
          }
          
          const enhancedError: EnhancedError = new Error();
          
          // Categorize Firebase Storage errors
          switch (error.code) {
            case 'storage/unauthorized':
              enhancedError.message = 'Upload permission denied. Please try again or contact support.';
              enhancedError.type = 'permission';
              enhancedError.canRetry = false;
              break;
            case 'storage/canceled':
              enhancedError.message = 'Upload was canceled. Please try uploading again.';
              enhancedError.type = 'generic';
              enhancedError.canRetry = true;
              break;
            case 'storage/quota-exceeded':
              enhancedError.message = 'Storage quota exceeded. Please contact the administrators.';
              enhancedError.type = 'storage';
              enhancedError.canRetry = false;
              break;
            case 'storage/retry-limit-exceeded':
              enhancedError.message = 'Upload failed after multiple attempts. Please check your internet connection and try again.';
              enhancedError.type = 'network';
              enhancedError.canRetry = true;
              break;
            case 'storage/invalid-checksum':
              enhancedError.message = 'File upload was corrupted. Please try uploading again.';
              enhancedError.type = 'generic';
              enhancedError.canRetry = true;
              break;
            default:
              // Check if it's a network error
              if (error.message?.toLowerCase().includes('network') || 
                  error.message?.toLowerCase().includes('fetch') ||
                  error.code === 'storage/unknown') {
                enhancedError.message = 'Network connection issue detected. Please check your internet connection and try again.';
                enhancedError.type = 'network';
                enhancedError.canRetry = true;
              } else {
                enhancedError.message = error.message || 'Upload failed. Please try again.';
                enhancedError.type = 'generic';
                enhancedError.canRetry = true;
              }
          }
          
          reject(enhancedError);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch {
            interface EnhancedError extends Error {
              type?: string;
              canRetry?: boolean;
            }
            
            const enhancedError: EnhancedError = new Error('Failed to retrieve uploaded file URL. Please try again.');
            enhancedError.type = 'network';
            enhancedError.canRetry = true;
            reject(enhancedError);
          }
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setCanRetry(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      // Set appropriate error type for validation errors
      if (validationError.includes('too large') || validationError.includes('Maximum size')) {
        setErrorType('file-size');
      } else {
        setErrorType('generic');
      }
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to submit? Take Note You will not be able to edit your submission after submitting.'
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    setVideoProgress(0);
    setPaymentProgress(0);
    setUploadStatus('Starting upload...');

    try {
      const submissionId = uuidv4();
      let auditionVideoUrl = '';
      let paymentProofUrl = '';

      // Upload audition video
      if (formData.auditionVideo) {
        setUploadStatus('Uploading audition video...');
        const videoExtension = formData.auditionVideo.name.split('.').pop();
        auditionVideoUrl = await uploadFileToStorage(
          formData.auditionVideo,
          `auditions/${submissionId}/video.${videoExtension}`,
          setVideoProgress
        );
      }

      // Upload payment proof
      if (formData.paymentProof) {
        setUploadStatus('Uploading payment proof...');
        const paymentExtension = formData.paymentProof.name.split('.').pop();
        paymentProofUrl = await uploadFileToStorage(
          formData.paymentProof,
          `auditions/${submissionId}/payment.${paymentExtension}`,
          setPaymentProgress
        );
      }

      // Submit to API
      setUploadStatus('Saving submission...');
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          zone: parseInt(formData.zone),
          area: parseInt(formData.area),
          province: formData.province,
          parishName: formData.parishName,
          parishPastorName: formData.parishPastorName,
          description: formData.description,
          auditionVideoUrl,
          paymentProofUrl,
          submissionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setUploadStatus('Success! Redirecting...');

      // Success - redirect to success page
      setTimeout(() => {
        router.push(`/success?id=${data.id}`);
      }, 500);
    } catch (err) {
      console.error('Submission error:', err);
      
      // Determine error type and message
      let errorMessage = '';
      let errorCategory: typeof errorType = 'generic';
      let retryable = true;
      
      interface EnhancedError extends Error {
        type?: string;
        canRetry?: boolean;
      }
      
      const enhancedErr = err as EnhancedError;
      
      if (enhancedErr.type) {
        // Enhanced error from uploadFileToStorage
        errorMessage = enhancedErr.message;
        errorCategory = enhancedErr.type as typeof errorType;
        retryable = enhancedErr.canRetry !== false;
      } else if (enhancedErr.message?.toLowerCase().includes('network') || 
                 enhancedErr.message?.toLowerCase().includes('fetch') ||
                 enhancedErr.message?.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
        errorCategory = 'network';
        retryable = true;
      } else if (enhancedErr.message?.toLowerCase().includes('timeout')) {
        errorMessage = 'Upload timed out. Your file might be too large or your connection might be slow. Please try again.';
        errorCategory = 'network';
        retryable = true;
      } else if (enhancedErr.message?.toLowerCase().includes('quota') || 
                 enhancedErr.message?.toLowerCase().includes('storage')) {
        errorMessage = 'Storage limit reached. Please contact the administrators.';
        errorCategory = 'storage';
        retryable = false;
      } else {
        errorMessage = enhancedErr.message || 'An unexpected error occurred during submission. Please try again.';
        errorCategory = 'generic';
        retryable = true;
      }
      
      setError(errorMessage);
      setErrorType(errorCategory);
      setCanRetry(retryable);
      setIsSubmitting(false);
      setUploadStatus('');
      
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Submit Your Audition</h1>
              <p className="text-green-100 mt-1 text-sm md:text-base">Favoured Family Regional Shift Competition</p>
            </div>
            <Link
              href="/"
              className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm md:text-base whitespace-nowrap"
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
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mb-6 rounded shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-lg flex items-center gap-2">
                    {errorType === 'network' && '🌐'}
                    {errorType === 'storage' && '💾'}
                    {errorType === 'file-size' && '📦'}
                    {errorType === 'permission' && '🔒'}
                    {errorType === 'generic' && '⚠️'}
                    Upload Failed
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">{error}</p>
                  
                  {/* Helpful tips based on error type */}
                  <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-xs font-semibold mb-2">💡 Troubleshooting Tips:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {errorType === 'network' && (
                        <>
                          <li>Check if you have a stable internet connection</li>
                          <li>Try moving to a location with better signal</li>
                          <li>If using mobile data, ensure you have sufficient data</li>
                          <li>Try connecting to a different network (WiFi/mobile data)</li>
                          <li>Close other apps that might be using bandwidth</li>
                        </>
                      )}
                      {errorType === 'storage' && (
                        <>
                          <li>Contact the administrators via email or phone</li>
                          <li>This is a temporary issue that will be resolved soon</li>
                        </>
                      )}
                      {errorType === 'file-size' && (
                        <>
                          <li>Compress your video file using a video compressor app</li>
                          <li>Ensure your video is under 500MB</li>
                          <li>Try using a lower video quality/resolution</li>
                          <li>Consider trimming the video if it&apos;s too long</li>
                        </>
                      )}
                      {errorType === 'permission' && (
                        <>
                          <li>This is a system configuration issue</li>
                          <li>Please contact the administrators for assistance</li>
                          <li>Provide them with this error message</li>
                        </>
                      )}
                      {errorType === 'generic' && (
                        <>
                          <li>Ensure your files are in the correct format</li>
                          <li>Check that your files aren&apos;t corrupted</li>
                          <li>Try refreshing the page and submitting again</li>
                          <li>If the problem persists, contact support</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setError('');
                    setErrorType('');
                    setCanRetry(false);
                  }}
                  className="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
              
              {/* Retry button */}
              {canRetry && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setError('');
                      setErrorType('');
                      setCanRetry(false);
                      setVideoProgress(0);
                      setPaymentProgress(0);
                      // Form data is preserved, user can resubmit
                    }}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    🔄 Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    ↻ Refresh Page
                  </button>
                </div>
              )}
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="zone"
                      value={formData.zone}
                      onChange={handleInputChange}
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 mt-1">
                      Accepted formats: MP4, MOV, AVI (Max 500MB)
                    </p>
                    {formData.auditionVideo && (
                      <p className="text-sm font-semibold mt-1 text-green-700">
                        📁 {formatFileSize(formData.auditionVideo.size)}
                      </p>
                    )}
                  </div>
                  {videoPreview && (
                    <div className="mt-2">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full text-gray-800 max-w-md rounded-lg border-2 border-green-200"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Instructions */}
                <div className="col-span-2 bg-gradient-to-r from-green-50 to-orange-50 border-2 border-green-300 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                    💳 Payment Details
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Please make your payment to the account below and upload proof of payment:
                  </p>
                  <div className="bg-white rounded-lg p-4 space-y-3 border border-green-200">
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Amount:</span>
                      <span className="text-base font-bold text-gray-900">₦5,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Bank Name:</span>
                      <span className="text-base font-bold text-gray-900">Providus Bank</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Account Number:</span>
                      <span className="text-base font-bold text-gray-900 font-mono">4706098097</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Account Name:</span>
                      <span className="text-base font-bold text-gray-900">RCCG Region 20 Youth Affairs</span>
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Proof <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    name="paymentProof"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 mt-1">
                      Accepted formats: JPG, PNG, PDF (Max 10MB)
                    </p>
                    {formData.paymentProof && (
                      <p className="text-sm font-semibold mt-1 text-green-700">
                        📁 {formatFileSize(formData.paymentProof.size)}
                      </p>
                    )}
                  </div>
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

              {/* Upload Progress */}
              {isSubmitting && (
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-4">{uploadStatus}</p>
                  
                  {/* Video Upload Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">🎥 Audition Video</p>
                      <p className="text-blue-700 font-bold">{videoProgress}%</p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Payment Upload Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">💳 Payment Proof</p>
                      <p className="text-blue-700 font-bold">{paymentProgress}%</p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${paymentProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-blue-700 mt-4 flex items-center gap-2">
                    <span className="animate-pulse">⚠️</span>
                    Please do not close this page or navigate away.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
