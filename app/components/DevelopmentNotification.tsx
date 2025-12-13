'use client';

import { X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function DevelopmentNotification() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const xAccountUrl = 'https://x.com/ayushedith'; // Update with your X account URL

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-slideUp">
      <div className="bg-heirlock-yellow border-4 border-black rounded-xl shadow-brutal p-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-heirlock-pink p-2 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-black text-lg leading-tight">
              We're Still in Alpha
            </h3>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-black hover:text-gray-700 transition-colors flex-shrink-0 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Message */}
        <p className="text-black font-semibold text-sm mb-4 leading-relaxed">
          There will be bugs. There will be rough edges. But we're <strong>honest</strong>, <strong>transparent</strong>, and here to help. <strong>Your feedback</strong> drives us forward. Let's build T.A.L.A. together.
        </p>

        {/* Feedback Button */}
        <a
          href={xAccountUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black text-heirlock-yellow border-3 border-black font-black px-5 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-brutal active:translate-y-[0px] active:shadow-none group"
        >
          <X className="w-4 h-4 group-hover:animate-bounce" />
          Send Feedback
        </a>
      </div>
    </div>
  );
}
