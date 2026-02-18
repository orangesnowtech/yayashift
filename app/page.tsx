import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-center">
                Favoured Family Regional Shift Competition
              </h1>
              <p className="text-center mt-2 text-green-100">
                March 27-28, 2026
              </p>
            </div>
            <Link
              href="/admin"
              className="text-green-100 hover:text-white text-sm underline"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Event Information Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-t-4 border-orange-500">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Welcome to the Audition Portal
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Join us for an exciting competition showcasing the best talent from our regions!
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                <h3 className="font-semibold text-green-800 mb-2">Event Schedule:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-600 font-bold mr-2">•</span>
                    <span><strong>Semi-Final:</strong> March 27, 2026 - 15 selected participants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 font-bold mr-2">•</span>
                    <span><strong>Final:</strong> March 28, 2026 - 6 finalists</span>
                  </li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                <h3 className="font-semibold text-orange-800 mb-2">Important Information:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Complete all required fields accurately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Upload your audition video and payment proof</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>You cannot edit your submission after submitting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>You will receive an email confirmation upon submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🎤</div>
              <div className="text-xl">Submit Your Audition</div>
              <div className="text-sm text-green-100 mt-2">Start your application</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Favoured Family Regional Shift Competition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
