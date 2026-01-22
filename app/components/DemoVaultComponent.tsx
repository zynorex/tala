'use client';

import { useState } from 'react';
import { Zap, Trash2, Download } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';

interface DemoVaultProps {
  onDemoCreated?: () => void;
  existingDemo?: boolean;
}

export default function DemoVaultComponent({ onDemoCreated, existingDemo = false }: DemoVaultProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(existingDemo);

  console.log('DemoVaultComponent rendered. showDemo:', showDemo, 'existingDemo:', existingDemo);

  const createDemoVault = async () => {
    console.log('Creating demo vault...');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No token found');
        toast({
          title: 'Authentication Required',
          description: 'Please sign in with your wallet first',
          type: 'error',
        });
        setIsLoading(false);
        return;
      }

      console.log('Fetching demo vault API...');
      const response = await fetch('/api/vaults/demo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok) {
        console.log('Demo vault created successfully');
        toast({
          title: 'Demo Vault Created 🎉',
          description: 'Download the sample files, decrypt them, and experience encryption in action',
          type: 'success',
        });
        setShowDemo(true);
        onDemoCreated?.();
      } else if (response.status === 200) {
        // Already exists
        console.log('Demo vault already exists');
        toast({
          title: 'Demo Vault Already Exists',
          description: 'You already have a demo vault ready. Visit your dashboard to explore it',
          type: 'info',
        });
        setShowDemo(true);
      } else if (response.status === 401) {
        console.log('Token expired');
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please sign in again to create a demo vault',
          type: 'error',
        });
        // Clear expired token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } else {
        console.log('Error response:', result);
        toast({
          title: 'Error',
          description: result.error || 'Failed to create demo vault',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Catch error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create demo vault',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDemoVault = async () => {
    if (!confirm('Are you sure you want to delete your demo vault? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in with your wallet',
          type: 'error',
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/vaults/demo', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Demo Vault Deleted',
          description: 'Your demo vault is gone. You can create a new one anytime you want to explore',
          type: 'success',
        });
        setShowDemo(false);
        onDemoCreated?.();
      } else if (response.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please sign in again',
          type: 'error',
        });
        // Clear expired token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete demo vault',
          type: 'error',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete demo vault',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showDemo) {
    return (
      <div className="bg-heirlock-green border-4 border-black p-8 shadow-brutal">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-black mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Test T.A.L.A. Risk Free
            </h3>
            <p className="text-black font-bold mb-3">
              Experience how T.A.L.A. works with a fully functional demo vault. Download files, decrypt them, and see encryption in action. Everything is real except the commitment.
            </p>
            <ul className="space-y-2 text-sm font-bold text-black">
              <li>✓ Three sample files included</li>
              <li>✓ Full encryption and decryption</li>
              <li>✓ All features enabled</li>
              <li>✓ Delete anytime with one click</li>
            </ul>
            <p className="text-xs text-black mt-3 italic opacity-90">
              We believe in building in public. Try it, break it, tell us what we should improve.
            </p>
          </div>
          <button
            onClick={createDemoVault}
            disabled={isLoading}
            className="px-8 py-4 bg-black text-heirlock-green font-black border-4 border-black shadow-brutal hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {isLoading ? 'Creating...' : 'Create Demo Vault'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-heirlock-blue border-4 border-black p-6 shadow-brutal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-heirlock-blue flex items-center justify-center font-black rounded-none">
            📚
          </div>
          <div>
            <h4 className="text-lg font-black text-black">Demo Vault Active</h4>
            <p className="text-sm font-bold text-gray-700">Three sample files ready to explore</p>
          </div>
        </div>
        <button
          onClick={deleteDemoVault}
          disabled={isLoading}
          className="px-4 py-2 bg-heirlock-pink text-black font-bold border-2 border-black hover:bg-red-500 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      <p className="text-sm text-black font-medium">
        This is your personal test environment. Download the files, decrypt them with the vault keys, and see how T.A.L.A. protects your data. When you are ready, create a real vault with your own files.
      </p>
    </div>
  );
}
