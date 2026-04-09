import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook to ensure auth token is available in localStorage
 * Generates token from NextAuth session if missing
 */
export function useAuthToken() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ensureToken = async () => {
      // If we have a session but no auth_token in localStorage, generate one
      if (session && status === 'authenticated') {
        const existingToken = localStorage.getItem('auth_token');
        
        if (!existingToken) {
          console.log('No auth_token found, generating from session...');
          try {
            const response = await fetch('/api/auth/generate-token', {
              method: 'POST',
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Token generated and stored in localStorage');
              localStorage.setItem('auth_token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              setIsReady(true);
            } else {
              console.error('Failed to generate token:', response.status);
              setIsReady(false);
            }
          } catch (error) {
            console.error('Error generating token:', error);
            setIsReady(false);
          }
        } else {
          // Token already exists
          setIsReady(true);
        }
      } else if (status === 'unauthenticated') {
        setIsReady(false);
      }
    };

    ensureToken();
  }, [session, status]);

  return { isReady, session, status };
}
