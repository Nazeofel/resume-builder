'use client';

import { useState } from 'react';

export default function TestCheckoutPage() {
  const [priceId, setPriceId] = useState('price_1SSzMtCxQRIqlS4diid3vbZz');
  const [userId, setUserId] = useState('6d9cd306-49f3-4f36-ad81-c55bf0252816');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending request with:', { priceId, userId, quantity });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          quantity,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setResult(data);
        // Redirect to Stripe checkout
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Stripe Checkout
          </h1>
          <p className="text-gray-600 mb-8">
            Test the complete checkout flow with Stripe
          </p>

          <div className="space-y-6">
            {/* Price ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Price ID
              </label>
              <input
                type="text"
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                placeholder="price_xxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Get this from your Stripe Dashboard → Products
              </p>
            </div>

            {/* User ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="user-123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                A valid userId from your database
              </p>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCheckout}
              disabled={loading || !priceId || !userId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Creating checkout session...' : 'Create Checkout Session'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">
                  Checkout session created!
                </p>
                <div className="text-sm text-green-700 space-y-1">
                  <p>
                    <strong>Session ID:</strong> {result.sessionId}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Redirecting to Stripe checkout...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Testing Instructions
            </h2>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">1.</span>
                <span>
                  Make sure Stripe CLI is running:{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    stripe listen --forward-to localhost:3000/api/webhooks/stripe
                  </code>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">2.</span>
                <span>Enter your test Price ID from Stripe Dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">3.</span>
                <span>Enter a valid User ID from your database</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">4.</span>
                <span>Click the button and you'll be redirected to Stripe Checkout</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">5.</span>
                <span>
                  Use test card:{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    4242 4242 4242 4242
                  </code>
                  {' '}with any future date and CVC
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">6.</span>
                <span>Watch the webhook events in your terminal</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-900">7.</span>
                <span>Check your database to confirm subscription usage was updated</span>
              </li>
            </ol>
          </div>

          {/* Test Cards */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Stripe Test Cards
            </h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p>
                <strong>Success:</strong> 4242 4242 4242 4242
              </p>
              <p>
                <strong>Declined:</strong> 4000 0000 0000 0002
              </p>
              <p>
                <strong>Auth Required:</strong> 4000 0027 6000 3184
              </p>
              <p className="mt-2 text-blue-600">
                Use any future expiry date, any 3-digit CVC, and any email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
