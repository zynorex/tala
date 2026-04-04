'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminShortcut() {
  const router = useRouter();
  const sequence = 'admin';
  const keySequenceRef = useRef('');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only listen to letter keys
      if (!e.key.match(/^[a-z]$/i)) {
        keySequenceRef.current = '';
        return;
      }

      // Add to sequence
      keySequenceRef.current += e.key.toLowerCase();

      // Keep only last 5 characters
      if (keySequenceRef.current.length > sequence.length) {
        keySequenceRef.current = keySequenceRef.current.slice(-sequence.length);
      }

      // Check if sequence matches 'admin'
      if (keySequenceRef.current === sequence) {
        e.preventDefault();
        keySequenceRef.current = ''; // Reset
        router.push('/admin/ADMIN');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, sequence]);
}
