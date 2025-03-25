import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageType: 'GoTo' | 'Trip';
  price: number;
  currency: string;
  onStartPurchase: () => void;
}

const AccessModal: React.FC<AccessModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageType,
  price,
  currency,
  onStartPurchase,
}) => {
  const router = useRouter();
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessKey, packageId }),
      });

      const data = await response.json();

      if (data.success) {
        // Store access details in localStorage or state management
        localStorage.setItem(
          `package_access_${packageId}`,
          JSON.stringify({
            email,
            accessKey,
            expiresAt: data.access.expiresAt,
          })
        );

        // Redirect to the package content
        router.push(`/view/${packageType.toLowerCase()}/${packageId}`);
      } else {
        setError(data.error || 'Invalid access key or email');
      }
    } catch (error) {
      setError('Failed to verify access. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBuyNow = () => {
    console.log('Buy Now clicked in AccessModal');
    // Start the purchase flow directly
    onStartPurchase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Access Package</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {!showAccessForm ? (
          <div className="space-y-6">
            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Buy Now - {price} {currency}
            </button>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              onClick={() => setShowAccessForm(true)}
              className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              I Have an Access Key
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyAccess} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Key
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                pattern="[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAccessForm(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isVerifying ? 'Verifying...' : 'Access Package'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccessModal;
