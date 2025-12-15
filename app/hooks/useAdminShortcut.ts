'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminShortcut() {
  const router = useRouter();
  const sequence = 'admin';
  let keySequence = '';

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only listen to letter keys
      if (!e.key.match(/^[a-z]$/i)) {
        keySequence = '';
        return;
      }

      // Add to sequence
      keySequence += e.key.toLowerCase();

      // Keep only last 5 characters
      if (keySequence.length > sequence.length) {
        keySequence = keySequence.slice(-sequence.length);
      }

      // Check if sequence matches 'admin'
      if (keySequence === sequence) {
        e.preventDefault();
        keySequence = ''; // Reset
        router.push('/admin/ADMIN');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
}
