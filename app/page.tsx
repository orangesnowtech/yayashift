'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const deadline = new Date('2026-03-22T18:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Image
              src="/rccg-logo-noBg-2.png"
              alt="RCCG Logo"
              width={80}
              height={80}
              className="object-contain"
            />
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
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto mb-16 text-center">
          <div className="bg-gradient-to-br from-green-700 via-green-600 to-orange-600 text-white rounded-2xl shadow-2xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Unleash Your Gift:<br />
                <span className="text-orange-200">Regional Shift Talent Hunt 2026</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-50 max-w-3xl mx-auto">
                The ultimate platform for young creatives within the Favored Family community to showcase their talent, win life-changing prizes, and gain global exposure.
              </p>
              <Link
                href="/submit"
                className="inline-block bg-white text-green-700 font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-xl hover:shadow-2xl"
              >
                <span className="text-2xl mr-2">🎥</span>
                Submit Your Audition
              </Link>
              
              {/* Countdown Timer */}
              <div className="mt-3 bg-white  bg-opacity-20 backdrop-blur-sm rounded-lg p-4 max-w-xl mx-auto">
                <p className=" text-green-700 text-base font-semibold mb-3">⏰ Auditions Close In:</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className=" bg-opacity-30 rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-700">{timeLeft.days}</div>
                    <div className="text-xs text-green-500 mt-1">Days</div>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-700">{timeLeft.hours}</div>
                    <div className="text-xs text-green-500 mt-1">Hours</div>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-700">{timeLeft.minutes}</div>
                    <div className="text-xs text-green-500 mt-1">Minutes</div>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-700">{timeLeft.seconds}</div>
                    <div className="text-xs text-green-500 mt-1">Seconds</div>
                  </div>
                </div>
                <p className="text-green-700 text-xs mt-3">Sunday, March 22 at 6:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Overview</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">The Vision</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Identify and Elevate Talent
              </p>
              <p className="text-gray-600 mt-4 text-center">
                Our primary goal is to identify and elevate the finest talents within the Favored Family, preparing them to compete on the prestigious International Shift stage.
              </p>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-orange-600 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🎭</div>
              <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">Core Categories</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">♪</span>
                  <div>
                    <strong>Music:</strong> Showcasing vocal and instrumental excellence.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">🎬</span>
                  <div>
                    <strong>Drama:</strong> Celebrating compelling storytelling and theatrical performance.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✨</span>
                  <div>
                    <strong>Unusual Creativity:</strong> Discovering unique talents in comedy and spoken word.
                  </div>
                </li>
              </ul>
            </div>

            {/* Goal */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🏆</div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">The Goal</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Select Top 6 for International Representation
              </p>
              <p className="text-gray-600 mt-4 text-center">
                We aim to select the Top 6 contestants—two from each core category—to proudly represent our Region at the International Shift Competition.
              </p>
            </div>
          </div>
        </section>

        {/* Road Map Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Road Map</h2>
          <div className="space-y-8">
            {/* Phase 1 */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl shadow-lg p-8 border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">1</span>
                Phase 1: Online Pre-Auditions
              </h3>
              <div className="ml-14 space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">📤 Submission:</h4>
                  <p className="text-gray-700">
                    Contestants will submit a compelling 120-second introductory and performance video via our dedicated online portal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">🔍 Screening:</h4>
                  <p className="text-gray-700">
                    A panel of professional judges will meticulously review all submissions, selecting the top 15 candidates—five from each category—to advance.
                  </p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg border-l-4 border-orange-600">
                  <h4 className="font-semibold text-orange-800 mb-2">⏰ Deadline:</h4>
                  <p className="text-gray-800 font-semibold">
                    Auditions close Sunday, March 22 at 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl shadow-lg p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">2</span>
                Phase 2: The Main Event (2 Days)
              </h3>
              <div className="ml-14 space-y-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h4 className="font-semibold text-green-700 mb-2">📅 Day 1 (Semi-Finals) - March 27, 2026:</h4>
                  <p className="text-gray-700">
                    The selected 15 contestants will perform live. Each participant must prepare two distinct acts to demonstrate their versatility and skill, vying for a spot in the finals.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-orange-600">
                  <h4 className="font-semibold text-orange-700 mb-2">🏅 Day 2 (Finals) - March 28, 2026:</h4>
                  <p className="text-gray-700">
                    The top 6 finalists compete for the grand prize and international representation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Judging Criteria Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Judging Criteria</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-orange-800 mb-6 text-center">Judges&apos; Scoring Criteria</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">💡</div>
                <h4 className="font-bold text-green-800">Originality</h4>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-2">👔</div>
                <h4 className="font-bold text-orange-800">Appearance</h4>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">🎬</div>
                <h4 className="font-bold text-green-800">Stage Management</h4>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-2">🎭</div>
                <h4 className="font-bold text-orange-800">Expression</h4>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-bold text-green-800">Audience Engagement</h4>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-bold text-orange-800">Overall Impact</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Cash Prizes Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Cash Prizes</h2>
          <div className="bg-gradient-to-br from-green-700 to-orange-600 rounded-xl shadow-2xl p-8 text-white">
            <p className="text-center text-xl mb-8 text-white font-semibold">Per Category</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center bg-white bg-opacity-20 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-5xl mb-4">🥇</div>
                <h3 className="text-2xl text-green-700 font-bold mb-2">Winner</h3>
                <p className="text-4xl text-green-900 font-extrabold">₦1,000,000</p>
              </div>
              <div className="text-center bg-white bg-opacity-20 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-5xl mb-4">🥈</div>
                <h3 className="text-2xl text-orange-700 font-bold mb-2">1st Runner Up</h3>
                <p className="text-4xl text-orange-900 font-extrabold">₦500,000</p>
              </div>
              <div className="text-center bg-white bg-opacity-20 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-5xl mb-4">🥉</div>
                <h3 className="text-2xl text-green-700 font-bold mb-2">2nd Runner Up</h3>
                <p className="text-4xl text-green-900 font-extrabold">₦300,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* The "Favored" Advantage Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">The &quot;Favored&quot; Advantage</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🎵</div>
              <h3 className="text-xl font-bold text-green-800 mb-3 text-center">Recording Deals</h3>
              <p className="text-gray-700 text-center">
                Opportunities via in-house label and studio partners.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🎤</div>
              <h3 className="text-xl font-bold text-orange-800 mb-3 text-center">Performance Slots</h3>
              <p className="text-gray-700 text-center">
                Guaranteed appearances at regional events for all winners.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4 text-center">🌍</div>
              <h3 className="text-xl font-bold text-green-800 mb-3 text-center">Direct International Entry</h3>
              <p className="text-gray-700 text-center">
                Winners gain direct entry to the International Shift Talent Hunt.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility & Rules Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Eligibility & Rules</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-3xl mr-4">👥</span>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Who can join:</h3>
                  <p className="text-gray-700">Open to all RCCG members from the Favored Family (No age limit).</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">⚖️</span>
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">Judging:</h3>
                  <p className="text-gray-700">3 Professional Judges per category</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✅</span>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Requirement:</h3>
                  <p className="text-gray-700">Must be a verified and clear member of an RCCG Favored Family parish.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information from Original */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="bg-orange-50 rounded-xl shadow-lg p-8 border-l-4 border-orange-600">
            <h3 className="text-2xl font-bold text-orange-800 mb-6">Important Information:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                <span className="text-gray-700">Complete all required fields accurately</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                <span className="text-gray-700">Upload your audition video and payment proof</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                <span className="text-gray-700">You cannot edit your submission after submitting</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                <span className="text-gray-700">You will receive an email confirmation upon submission</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600 to-orange-600 rounded-2xl shadow-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Talent?</h2>
            <p className="text-xl mb-8 text-green-50">Join the Regional Shift Talent Hunt 2026 today!</p>
            <Link
              href="/submit"
              className="inline-block bg-white text-green-700 font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-xl hover:shadow-2xl"
            >
              <span className="text-2xl mr-2">🎥</span>
              Submit Your Audition
            </Link>
          </div>
        </section>
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
