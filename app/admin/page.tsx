'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Submission } from '@/lib/types';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, validate against server-side
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      fetchSubmissions();
    } else {
      setError('Invalid password');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string, notes: string = '') => {
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, notes }),
      });

      if (response.ok) {
        // Refresh submissions
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesFilter = filter === 'all' || submission.status === filter;
    const matchesSearch =
      searchTerm === '' ||
      submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
              <p className="text-gray-600 mt-2">Enter password to access dashboard</p>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 mb-4 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-100 mt-1">
                Favoured Family Regional Shift Competition
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">
              {submissions.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Submissions</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600">
              {submissions.filter((s) => s.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">
              {submissions.filter((s) => s.status === 'selected').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Selected</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">
              {submissions.filter((s) => s.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {submission.firstName} {submission.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {submission.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {submission.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linear-to-r from-green-600 to-orange-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Personal Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">
                      {selectedSubmission.firstName} {selectedSubmission.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedSubmission.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Region</label>
                    <p className="text-gray-900">{selectedSubmission.region}</p>
                  </div>
                </div>
              </div>

              {/* Church Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                  Church Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Province</label>
                    <p className="text-gray-900">{selectedSubmission.province}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parish Name</label>
                    <p className="text-gray-900">{selectedSubmission.parishName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Parish Pastor Name
                    </label>
                    <p className="text-gray-900">{selectedSubmission.parishPastorName}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                  Description
                </h3>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedSubmission.description}
                </p>
              </div>

              {/* Files */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                  Uploaded Files
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Audition Video
                    </label>
                    <a
                      href={selectedSubmission.auditionVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      View Video
                    </a>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Payment Proof
                    </label>
                    <a
                      href={selectedSubmission.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Payment Proof
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                  Update Status
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      updateSubmissionStatus(selectedSubmission.id!, 'pending')
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      updateSubmissionStatus(selectedSubmission.id!, 'reviewed')
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() =>
                      updateSubmissionStatus(selectedSubmission.id!, 'selected')
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Selected
                  </button>
                  <button
                    onClick={() =>
                      updateSubmissionStatus(selectedSubmission.id!, 'rejected')
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* Notes */}
              {selectedSubmission.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-200">
                    Admin Notes
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
