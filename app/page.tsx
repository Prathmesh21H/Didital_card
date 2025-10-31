// app/page.tsx
import Link from 'next/link';
import { CreditCard, QrCode, Edit, Share2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">Digital Card</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Digital Visiting Card
          <br />
          <span className="text-indigo-600">Always Updated, Never Lost</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create a permanent digital visiting card with a QR code. Update your details anytime,
          and let anyone save your contact with a single tap.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 font-semibold transition shadow-lg"
        >
          Create Your Card Now
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Profile
            </h3>
            <p className="text-gray-600">
              Sign up and fill in your contact details, social links, and bio
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get QR Code
            </h3>
            <p className="text-gray-600">
              Receive a unique QR code linking to your digital card
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Share Anywhere
            </h3>
            <p className="text-gray-600">
              Add QR code to business cards, email signatures, or social media
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Update Anytime
            </h3>
            <p className="text-gray-600">
              Change your details anytime - QR code stays the same
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Digital Visiting Cards?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                No more printing and reprinting paper cards
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Updated</h3>
              <p className="text-gray-600">
                Change phone number or job? Update once, everywhere
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">One-Tap Save</h3>
              <p className="text-gray-600">
                Contacts save you instantly to their phone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Go Digital?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of professionals using digital visiting cards
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 font-semibold transition shadow-lg"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Digital Visiting Card. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}