'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Lock, Upload, FileText, AlertCircle, CheckCircle, Loader, Calendar, Info, Shield, Clock, X, Key, Copy, Download, Image as ImageIcon, Zap } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useVaultContract } from '@/app/hooks/useVaultContract';
import { validators } from '@/lib/validators/input-validators';
import { generatePreview, detectFileCategory } from '@/lib/utils/file-preview';
import { keccak256, toBytes } from 'viem';

interface CreateVaultFormProps {
  demoMode?: boolean;
}

interface FormState {
  vaultName: string;
  vaultDescription: string;
  file: File | null;
  decryptionKey: string;
  unlockDate: string;
  unlockTime: string;
  isSubmitting: boolean;
  acceptTerms: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
  timestamp?: number;
  gasFee?: string;
}

export default function CreateVaultForm({ demoMode = false }: CreateVaultFormProps) {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createVault: createVaultOnChain, isLoading: isChainLoading } = useVaultContract();

  // Date constraints
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  // For demo mode, set defaults
  const defaultVaultName = demoMode ? 'My Demo Vault' : '';
  const defaultDescription = demoMode ? 'Testing TALA time-locking technology (auto-unlocks in 2 minutes)' : '';

  const [form, setForm] = useState<FormState>({
    vaultName: defaultVaultName,
    vaultDescription: defaultDescription,
    file: null,
    decryptionKey: '',
    unlockDate: '',
    unlockTime: '12:00',
    isSubmitting: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyDownloaded, setKeyDownloaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filePreview, setFilePreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Check authentication status on mount and address change
  // Check authentication status on mount and address change
  useEffect(() => {
    if (!isConnected || !address) {
      setIsAuthenticated(false);
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Check if token is for the current address
        if (user.walletAddress?.toLowerCase() === address.toLowerCase()) {
          // Validate token is still valid with API call
          fetch('/api/users/auth', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          }).then(res => {
            if (res.ok) {
              console.log('✅ Token validated, user authenticated:', user.walletAddress);
              setIsAuthenticated(true);
            } else {
              console.log('❌ Token expired/invalid, clearing...');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              setIsAuthenticated(false);
            }
          }).catch(() => {
            console.log('❌ Token validation failed');
            setIsAuthenticated(false);
          });
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    
    // Clear old tokens if address changed
    console.log('🔄 Clearing old auth tokens for new address');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }, [isConnected, address]);

  // Validate existing token by making a test API call
  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/auth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Manual authentication function
  const authenticateWallet = useCallback(async () => {
    if (!isConnected || !address) {
      toast('Please connect your wallet first', 'error');
      return false;
    }

    const existingToken = localStorage.getItem('auth_token');
    if (existingToken) {
      // Validate the token is still valid
      console.log('🔍 Validating existing token...');
      const isValid = await validateToken(existingToken);
      if (isValid) {
        console.log('✅ Token is valid');
        setIsAuthenticated(true);
        return true;
      }
      console.log('❌ Token expired or invalid, re-authenticating...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    console.log('🔐 Starting wallet authentication...');
    setIsAuthenticating(true);
    try {
      const message = `Sign in to TALA\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`;
      console.log('📝 Requesting signature for message');
      const signature = await signMessageAsync({ message });

      console.log('✍️ Signature received, sending to backend');
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await response.json();
      console.log('📡 Backend response:', data);

      if (response.ok && data.success && data.data?.token) {
        console.log('✅ Authentication successful! Storing token...');
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setIsAuthenticated(true);
        toast('Wallet authenticated successfully!', 'success');
        return true;
      } else {
        console.error('❌ Authentication failed:', data);
        toast(data.error || 'Authentication failed', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      if (error.message?.includes('User rejected')) {
        toast('Signature rejected. Please sign to continue.', 'error');
      } else {
        toast('Authentication failed. Please try again.', 'error');
      }
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [isConnected, address, signMessageAsync, toast, validateToken]);

  // Generate secure decryption key
  const generateDecryptionKey = useCallback((): string => {
    const array = new Uint8Array(32); // 256 bits
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  // Generate key on file selection
  const handleFileSelect = useCallback((file: File | null) => {
    if (file && !form.decryptionKey) {
      const newKey = generateDecryptionKey();
      setForm(prev => ({ ...prev, file, decryptionKey: newKey }));
      setKeyCopied(false);
      setKeyDownloaded(false);
    } else {
      setForm(prev => ({ ...prev, file }));
    }
  }, [form.decryptionKey, generateDecryptionKey]);

  // Copy key to clipboard
  const copyKeyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(form.decryptionKey);
    setKeyCopied(true);
    toast('Decryption key copied to clipboard!', 'success');
  }, [form.decryptionKey, toast]);

  // Download key as text file
  const downloadKey = useCallback(() => {
    const blob = new Blob([`TALA Vault Decryption Key\n\nVault: ${form.vaultName || 'Unnamed'}\nGenerated: ${new Date().toLocaleString()}\n\nDecryption Key:\n${form.decryptionKey}\n\nIMPORTANT: Keep this key safe! You will need it to decrypt your vault after the unlock time.\nTALA cannot recover lost keys.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TALA-vault-key-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setKeyDownloaded(true);
    toast('Decryption key downloaded!', 'success');
  }, [form.decryptionKey, form.vaultName, toast]);

  // Drag & drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    const sizeValidation = validators.fileSize(file.size, 50 * 1024 * 1024);
    if (!sizeValidation.valid) {
      setErrors({ ...errors, file: sizeValidation.error || 'File size invalid' });
      toast(sizeValidation.error || 'File size invalid', 'error');
      return;
    }

    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.app', '.msi', '.dll', '.scr'];
    if (dangerousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setErrors({ ...errors, file: 'Executable files are not allowed for security reasons' });
      toast('Executable files are not allowed', 'error');
      return;
    }

    handleFileSelect(file);
    setErrors({ ...errors, file: '' });
    toast(`File selected: ${file.name}`, 'success');

    // Generate preview
    generateFilePreview(file);
  };

  const generateFilePreview = async (file: File) => {
    try {
      setPreviewLoading(true);
      const preview = await generatePreview(file, file.type || 'application/octet-stream');
      setFilePreview(preview);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setFilePreview(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Validate complete form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.vaultName.trim()) {
      newErrors.vaultName = 'Vault name is required';
    } else if (form.vaultName.length > 255) {
      newErrors.vaultName = 'Vault name must be less than 255 characters';
    }

    if (form.vaultDescription && form.vaultDescription.length > 1000) {
      newErrors.vaultDescription = 'Description must be less than 1000 characters';
    }

    if (!form.file) {
      newErrors.file = 'Please select a file to encrypt';
    }

    if (!form.decryptionKey) {
      newErrors.decryptionKey = 'Decryption key is required (auto-generated when file is selected)';
    }

    if (!keyCopied && !keyDownloaded) {
      newErrors.decryptionKey = 'You must copy or download the decryption key before proceeding';
    }

    // Skip date validation for demo mode (auto-set to 2 minutes)
    if (!demoMode) {
      if (!form.unlockDate) {
        newErrors.unlockDate = 'Unlock date is required';
      } else {
        const unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`);
        const now = new Date();
        
        if (unlockDateTime <= now) {
          newErrors.unlockDate = 'Unlock time must be in the future';
        }

        const minUnlockTime = new Date(now.getTime() + 60 * 1000); // 1 minute from now
        if (unlockDateTime < minUnlockTime) {
          newErrors.unlockDate = 'Unlock time must be at least 1 minute in the future';
        }
      }
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step management functions
  const initializeSteps = useCallback(() => {
    const baseSteps: ProcessingStep[] = [
      { id: 'validate', label: 'Validating form', status: 'pending' },
      { id: 'authenticate', label: 'Authenticating wallet', status: 'pending' },
      { id: 'create-vault', label: 'Creating vault', status: 'pending' },
    ];

    // Add blockchain step for real vaults
    if (!demoMode) {
      baseSteps.push({ id: 'blockchain', label: 'Processing blockchain transaction', status: 'pending' });
    }

    baseSteps.push(
      { id: 'process-file', label: 'Processing file', status: 'pending' },
      { id: 'encrypt-file', label: 'Encrypting file', status: 'pending' },
      { id: 'upload-ipfs', label: 'Uploading to IPFS', status: 'pending' },
      { id: 'finalize', label: 'Finalizing vault', status: 'pending' }
    );

    setProcessingSteps(baseSteps);
    setShowProgressModal(true);
  }, [demoMode]);

  const updateStep = useCallback((stepId: string, status: 'in-progress' | 'completed' | 'error', message?: string) => {
    setProcessingSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, status, message, timestamp: Date.now() }
          : step
      )
    );
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started', { isConnected, address, form });

    if (!isConnected || !address) {
      toast('Please connect your wallet first', 'error');
      return;
    }

    // Initialize progress tracking
    initializeSteps();
    updateStep('validate', 'in-progress');

    const isValid = validateForm();
    console.log('Form validation result:', isValid, 'Errors:', errors);
    
    if (!isValid) {
      updateStep('validate', 'error', 'Form validation failed');
      toast('Please fix all errors before submitting', 'error');
      setTimeout(() => setShowProgressModal(false), 2000);
      return;
    }

    updateStep('validate', 'completed');
    updateStep('authenticate', 'in-progress');

    // Check authentication
    let token = localStorage.getItem('auth_token');
    console.log('Current auth token:', token ? 'exists' : 'missing');
    
    if (!token) {
      console.log('Attempting to authenticate wallet...');
      const authenticated = await authenticateWallet();
      if (!authenticated) {
        updateStep('authenticate', 'error', 'Wallet authentication failed');
        setTimeout(() => setShowProgressModal(false), 2000);
        return;
      }
      token = localStorage.getItem('auth_token');
    }

    updateStep('authenticate', 'completed');
    updateStep('create-vault', 'in-progress');

    setForm({ ...form, isSubmitting: true });

    try {

      // Step 1: Create vault
      let unlockDateTime: Date;
      
      if (demoMode) {
        // Demo vaults auto-unlock after 5 minutes
        unlockDateTime = new Date(Date.now() + 5 * 60 * 1000);
        console.log('[DEMO] Creating demo vault with 5-minute auto-unlock');
      } else {
        // Regular: use form date/time
        unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`);
      }

      const unlockTimestamp = Math.floor(unlockDateTime.getTime() / 1000);

      console.log('[VAULT] Creating vault with data:', {
        name: form.vaultName,
        description: form.vaultDescription,
        unlockTimestamp,
        isDemo: demoMode,
        unlockDate: unlockDateTime.toISOString(),
      });

      const requestBody = {
        name: form.vaultName,
        description: form.vaultDescription,
        password: form.decryptionKey,
        unlockTime: unlockDateTime.toISOString(), // Send ISO string, not Unix timestamp
        isDemo: demoMode,
      };

      console.log('[VAULT] Request body:', JSON.stringify(requestBody));

      const createRes = await fetch('/api/vaults', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[VAULT] Create vault response status:', createRes.status);

      if (!createRes.ok) {
        const data = await createRes.json();
        console.error('[VAULT] Create vault error:', data);
        updateStep('create-vault', 'error', data.error || 'Failed to create vault');
        throw new Error(data.error || 'Failed to create vault');
      }

      const vaultData = await createRes.json();
      console.log('[VAULT] Vault created successfully:', vaultData);
      
      const vaultId = vaultData.data?.id;

      if (!vaultId) {
        console.error('[VAULT] No vault ID in response:', vaultData);
        updateStep('create-vault', 'error', 'No vault ID returned');
        throw new Error('No vault ID returned from server');
      }

      updateStep('create-vault', 'completed');

      // Step 1.5: For real vaults, create blockchain record
      if (!demoMode) {
        updateStep('blockchain', 'in-progress', 'Waiting for wallet confirmation...');
        
        try {
          // Create encrypted key hash (keccak256 of encrypted key)
          const encryptedKeyHash = keccak256(toBytes(form.decryptionKey));
          
          // For real vaults, we need IPFS hash, but file hasn't been uploaded yet
          // So we'll use a placeholder and update the contract after file upload
          const placeholderIpfsHash = 'QmPlaceholder0000000000000000000000000000000000'; // Will be updated after upload
          
          // Get file size for contract
          const fileSize = form.file?.size || 0;

          console.log('[BLOCKCHAIN] Calling smart contract createVault with:', {
            ipfsHash: placeholderIpfsHash,
            encryptedKeyHash,
            unlockTime: unlockTimestamp,
            description: form.vaultDescription,
            fileSize,
          });

          // Call smart contract and wait for confirmation
          // This will show the user a wallet popup to approve the transaction and pay gas fees
          let transactionRejected = false;
          
          await new Promise<void>((resolve, reject) => {
            try {
              // Set up timeout for wallet confirmation (30 seconds)
              const confirmationTimeout = setTimeout(() => {
                if (!transactionRejected) {
                  clearTimeout(confirmationTimeout);
                  transactionRejected = true;
                  reject(new Error('Wallet confirmation timeout - please try again'));
                }
              }, 30000);

              createVaultOnChain(
                placeholderIpfsHash,
                encryptedKeyHash,
                unlockTimestamp,
                form.vaultDescription,
                fileSize
              );

              // Monitor for transaction success or rejection
              updateStep('blockchain', 'in-progress', 'Confirm transaction in your wallet...');
              
              // Check if transaction was submitted (hook will update isChainLoading)
              const transactionCheck = setInterval(() => {
                // If user rejected, isChainLoading stays false and no hash is generated
                // We need a way to detect rejection - check if enough time has passed
                if (transactionRejected) {
                  clearInterval(transactionCheck);
                  clearTimeout(confirmationTimeout);
                  return;
                }
              }, 500);

              // Wait up to 120 seconds for final confirmation
              const maxWaitTime = 120000;
              const startTime = Date.now();
              
              const finalCheck = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed > maxWaitTime) {
                  clearInterval(finalCheck);
                  clearInterval(transactionCheck);
                  clearTimeout(confirmationTimeout);
                  
                  if (!transactionRejected) {
                    updateStep('blockchain', 'completed', 'Transaction submitted to blockchain');
                    resolve();
                  }
                }
              }, 1000);

            } catch (err) {
              transactionRejected = true;
              reject(err);
            }
          });

          if (!transactionRejected) {
            updateStep('blockchain', 'completed', 'Transaction confirmed on blockchain');
          }
        } catch (blockchainError) {
          console.error('[BLOCKCHAIN] Error creating vault on-chain:', blockchainError);
          const errorMessage = blockchainError instanceof Error ? blockchainError.message : 'Transaction failed or was rejected';
          
          // Check if it's a user rejection
          const isRejection = errorMessage.toLowerCase().includes('rejected') || 
                             errorMessage.toLowerCase().includes('user denied') ||
                             errorMessage.toLowerCase().includes('denied');
          
          updateStep('blockchain', 'error', isRejection ? 'Transaction rejected by user' : errorMessage);
          throw new Error(`Blockchain transaction failed: ${errorMessage}`);
        }
      }

      updateStep('process-file', 'in-progress');
      updateStep('encrypt-file', 'in-progress');

      // Step 2: Upload file (only if file exists)
      let fileUploadSuccess = false;
      let uploadError = null;
      
      if (form.file) {
        try {
          const formData = new FormData();
          formData.append('file', form.file);
          formData.append('encryptionPassword', form.decryptionKey);
          formData.append('vaultId', vaultId);

          updateStep('process-file', 'completed');
          updateStep('encrypt-file', 'in-progress', 'Encrypting file with AES-256...');
          updateStep('upload-ipfs', 'in-progress', 'Uploading to IPFS...');

          const uploadRes = await fetch('/api/vaults/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json().catch(() => ({ error: `HTTP ${uploadRes.status}` }));
            uploadError = errorData.error || `Upload failed with status ${uploadRes.status}`;
            console.error('[VAULT] Upload HTTP error:', uploadRes.status, errorData);
            updateStep('encrypt-file', 'error', 'Encryption failed');
            updateStep('upload-ipfs', 'error', uploadError);
            throw new Error(uploadError);
          }

          const uploadData = await uploadRes.json();
          
          // Verify response structure
          if (!uploadData.success || !uploadData.fileId || !uploadData.ipfsHash) {
            uploadError = uploadData.error || 'Invalid response from server';
            console.error('[VAULT] Invalid upload response:', uploadData);
            updateStep('encrypt-file', 'error', 'Encryption failed');
            updateStep('upload-ipfs', 'error', uploadError);
            throw new Error(uploadError);
          }

          console.log('[VAULT] File uploaded successfully', uploadData);
          fileUploadSuccess = true;
          updateStep('encrypt-file', 'completed');
          updateStep('upload-ipfs', 'completed');
        } catch (uploadErr) {
          const errMsg = uploadErr instanceof Error ? uploadErr.message : 'File upload failed';
          console.error('[VAULT] File upload error:', errMsg);
          updateStep('encrypt-file', 'error', 'Encryption failed');
          updateStep('upload-ipfs', 'error', uploadError || errMsg);
          throw new Error(`File upload failed: ${uploadError || errMsg}`);
        }
      } else {
        // No file provided - skip file steps
        console.log('[VAULT] No file to upload, skipping file upload steps');
        updateStep('process-file', 'completed');
        updateStep('encrypt-file', 'completed');
        updateStep('upload-ipfs', 'completed');
      }

      updateStep('finalize', 'in-progress', 'Finalizing vault creation...');

      // Validate vault was created in database
      if (!vaultId) {
        updateStep('finalize', 'error', 'Vault ID missing');
        throw new Error('Vault creation failed - no vault ID');
      }

      // Verify vault exists in database by fetching it
      try {
        const verifyRes = await fetch(`/api/vaults/${vaultId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!verifyRes.ok) {
          updateStep('finalize', 'error', 'Vault verification failed');
          throw new Error('Vault creation failed - could not verify vault exists');
        }

        const vaultDetails = await verifyRes.json();
        if (!vaultDetails.data || !vaultDetails.data.id) {
          updateStep('finalize', 'error', 'Vault verification failed');
          throw new Error('Vault creation failed - invalid vault data');
        }

        console.log('[VAULT] Vault verified successfully:', vaultDetails.data);
        updateStep('finalize', 'completed', 'Vault created and verified');
      } catch (verifyErr) {
        const errMsg = verifyErr instanceof Error ? verifyErr.message : 'Verification failed';
        console.error('[VAULT] Vault verification error:', errMsg);
        updateStep('finalize', 'error', errMsg);
        throw verifyErr;
      }

      // Reset form
      setForm({
        vaultName: demoMode ? 'My Demo Vault' : '',
        vaultDescription: demoMode ? 'Testing TALA time-locking technology (auto-unlocks in 2 minutes)' : '',
        file: null,
        decryptionKey: '',
        unlockDate: '',
        unlockTime: '12:00',
        isSubmitting: false,
        acceptTerms: false,
      });
      setErrors({});
      setKeyCopied(false);
      setKeyDownloaded(false);

      updateStep('finalize', 'completed');

      const successMsg = demoMode 
        ? 'Vault created successfully! It will auto-unlock in 2 minutes.' 
        : fileUploadSuccess
        ? 'Vault created and file secured successfully!'
        : 'Vault created successfully! No files were uploaded.';
      
      toast(successMsg, 'success');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to vault after showing success
      setTimeout(() => {
        console.log('[VAULT] Redirecting to vault:', vaultId);
        router.push(`/vault/${vaultId}`);
      }, 2000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vault';
      toast(message, 'error');
      setErrors({ submit: message });
      // Progress modal will close after timeout set in updateStep error calls
    } finally {
      setForm({ ...form, isSubmitting: false });
      // Close progress modal after a slight delay
      setTimeout(() => setShowProgressModal(false), 1500);
    }
  };

  if (!isConnected) {
    return (
      <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-black text-xl mb-2">Wallet Required</h3>
            <p className="text-gray-800 font-medium">
              Please connect your wallet to create a vault. Click the "Connect Wallet" button in the navbar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticating) {
    return (
      <div className="border-4 border-black p-8 bg-heirlock-blue shadow-brutal">
        <div className="flex items-start gap-4">
          <Loader className="w-6 h-6 text-black flex-shrink-0 mt-1 animate-spin" />
          <div>
            <h3 className="font-black text-black text-xl mb-2">Authenticating Wallet</h3>
            <p className="text-gray-800 font-medium">
              Please sign the message in your wallet to continue...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected && !isAuthenticated) {
    return (
      <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-black text-black text-xl mb-2">Authentication Required</h3>
            <p className="text-gray-800 font-medium mb-4">
              Please sign a message to authenticate your wallet and create vaults.
            </p>
            <button
              onClick={authenticateWallet}
              disabled={isAuthenticating}
              className="px-6 py-3 border-4 border-black bg-black text-white font-black hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isAuthenticating ? 'Signing...' : 'Sign to Authenticate'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Mode Notice */}
      {demoMode && (
        <div className="border-4 border-black p-6 bg-heirlock-green shadow-brutal">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-black flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-black text-black text-lg mb-2">⏱️ Demo Vault Mode (2 Minutes)</h3>
              <p className="text-sm text-gray-800 font-medium mb-2">
                Experience the full TALA workflow! This vault uses real encryption and will auto-unlock in 2 minutes.
              </p>
              <ul className="text-sm text-gray-800 font-medium space-y-1 list-disc list-inside">
                <li>Real AES-256-GCM encryption</li>
                <li>Upload any file up to 50MB</li>
                <li>Download and save your encryption key</li>
                <li>Auto-unlocks in 2 minutes for testing</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className={`border-4 border-black p-6 ${demoMode ? 'bg-heirlock-yellow' : 'bg-heirlock-blue'} shadow-brutal`}>
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-black text-lg mb-2">Enterprise-Grade Security</h3>
            <ul className="text-sm text-gray-800 font-medium space-y-1 list-disc list-inside">
              <li>AES-256-GCM encryption with PBKDF2 key derivation</li>
              <li>Files encrypted client-side before upload</li>
              <li>Decentralized storage on IPFS via Pinata</li>
              <li>Time-locked on blockchain (Polygon)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Vault Name */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          Vault Name *
        </label>
        <input
          type="text"
          maxLength={255}
          value={form.vaultName}
          onChange={(e) => {
            setForm({ ...form, vaultName: e.target.value });
            setErrors({ ...errors, vaultName: '' });
          }}
          placeholder="e.g., 'Important Documents 2025'"
          className={`w-full px-4 py-3 border-4 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-black/20 ${
            errors.vaultName ? 'ring-4 ring-red-500' : ''
          }`}
        />
        <p className="text-xs text-gray-600 font-medium">{form.vaultName.length}/255 characters</p>
        {errors.vaultName && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.vaultName}
          </span>
        )}
      </div>

      {/* Vault Description */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          Description (Optional)
        </label>
        <textarea
          maxLength={1000}
          value={form.vaultDescription}
          onChange={(e) => {
            setForm({ ...form, vaultDescription: e.target.value });
            setErrors({ ...errors, vaultDescription: '' });
          }}
          placeholder="What is this vault for?"
          className={`w-full px-4 py-3 border-4 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-black/20 ${
            errors.vaultDescription ? 'ring-4 ring-red-500' : ''
          }`}
          rows={3}
        />
        <p className="text-xs text-gray-600 font-medium">{form.vaultDescription.length}/1000 characters</p>
        {errors.vaultDescription && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.vaultDescription}
          </span>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Upload className="w-4 h-4 inline mr-2" />
          File to Encrypt * (Max 50 MB)
        </label>
        <div
          className={`border-4 border-dashed p-8 transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : errors.file
              ? 'border-red-500 bg-red-50'
              : 'border-black bg-cream hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={form.isSubmitting}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {form.file ? (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-black flex-shrink-0" />
                    <p className="font-black text-black truncate">{form.file.name}</p>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    Size: {(form.file.size / 1024 / 1024).toFixed(2)} MB / 50 MB
                  </p>
                  <div className="w-full bg-gray-300 border-2 border-black h-3 rounded-sm overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        form.file.size > 50 * 1024 * 1024 ? 'bg-red-500' : 'bg-heirlock-green'
                      }`}
                      style={{ width: `${Math.min((form.file.size / (50 * 1024 * 1024)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm({ ...form, file: null });
                    setFilePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-2 border-2 border-black bg-white hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="font-black text-black mb-1">Click to select file or drag & drop</p>
                <p className="text-xs text-gray-600 font-medium mt-2">Maximum file size: 50 MB</p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Supported: All file types except executables (.exe, .bat, .sh, etc.)
                </p>
              </div>
            )}
          </label>
        </div>
        {errors.file && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.file}
          </span>
        )}

        {/* File Preview */}
        {form.file && filePreview && (
          <div className="mt-4 border-4 border-black bg-cream p-4">
            {previewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-heirlock-blue" />
                <p className="ml-2 font-bold">Generating preview...</p>
              </div>
            ) : filePreview.type === 'image' && filePreview.preview ? (
              <div className="space-y-2">
                <p className="text-xs font-black text-black uppercase">Preview</p>
                <div className="relative w-full max-h-48 overflow-hidden border-2 border-black bg-black">
                  <img
                    src={filePreview.preview}
                    alt="File preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : filePreview.type === 'text' && filePreview.preview ? (
              <div className="space-y-2">
                <p className="text-xs font-black text-black uppercase">Preview (First 200 characters)</p>
                <div className="bg-black text-heirlock-green p-3 font-mono text-xs overflow-x-auto max-h-32 overflow-y-auto border-2 border-black">
                  <p className="whitespace-pre-wrap break-words">{filePreview.preview}</p>
                </div>
                {filePreview.metadata && (
                  <div className="text-xs text-gray-700 mt-2 grid grid-cols-3 gap-2">
                    <span>Lines: {filePreview.metadata.lines}</span>
                    <span>Words: {filePreview.metadata.words}</span>
                    <span>Chars: {filePreview.metadata.characters}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-black">
                <FileText className="w-5 h-5 text-gray-600" />
                <p className="text-sm font-bold text-gray-700">
                  Preview not available for {filePreview.type} files
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unlock Date & Time - Hidden in Demo Mode */}
      {!demoMode ? (
        <div className="space-y-2">
          <label className="font-black text-black text-sm uppercase block">
            <Clock className="w-4 h-4 inline mr-2" />
            Unlock Date & Time *
          </label>
          <p className="text-xs text-gray-700 font-medium mb-3">
            Choose when the vault will unlock. Can be from 1 minute to 100 years in the future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={form.unlockDate}
                onChange={(e) => {
                  setForm({ ...form, unlockDate: e.target.value });
                  setErrors({ ...errors, unlockDate: '' });
                }}
                className={`w-full px-4 py-3 border-4 border-black bg-cream font-bold text-black focus:outline-none focus:ring-4 focus:ring-heirlock-yellow transition-all hover:bg-heirlock-yellow/30 cursor-pointer ${
                  errors.unlockDate ? 'ring-4 ring-red-500' : ''
                }`}
                style={{
                  colorScheme: 'light',
                }}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="time"
                value={form.unlockTime}
                onChange={(e) => {
                  setForm({ ...form, unlockTime: e.target.value });
                  setErrors({ ...errors, unlockDate: '' });
                }}
                className={`w-full px-4 py-3 border-4 border-black bg-cream font-bold text-black focus:outline-none focus:ring-4 focus:ring-heirlock-yellow transition-all hover:bg-heirlock-yellow/30 cursor-pointer ${
                  errors.unlockDate ? 'ring-4 ring-red-500' : ''
                }`}
                style={{
                  colorScheme: 'light',
                }}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
            </div>
          </div>
          {form.unlockDate && form.unlockTime && (
            <div className="border-4 border-black p-4 bg-heirlock-yellow shadow-brutal">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-black" />
                <p className="text-sm font-black text-black">
                  Vault unlocks: {new Date(`${form.unlockDate}T${form.unlockTime}`).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
          {errors.unlockDate && (
            <span className="text-xs text-red-600 font-black flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.unlockDate}
            </span>
        )}
        </div>
      ) : (
        <div className="border-4 border-black p-6 bg-heirlock-blue shadow-brutal">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-black flex-shrink-0" />
            <div>
              <h3 className="font-black text-black text-lg mb-1">⏱️ Auto-Unlock: 2 Minutes</h3>
              <p className="text-sm text-gray-800 font-medium">
                This demo vault will automatically unlock 2 minutes after creation. Perfect for testing the full TALA experience!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decryption Key */}
      {form.decryptionKey && (
        <div className="border-4 border-black p-6 bg-gradient-to-br from-heirlock-yellow to-yellow-100 shadow-brutal">
          <div className="flex items-start gap-3 mb-4">
            <Key className="w-6 h-6 text-black flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-black text-black text-lg mb-2">Your Decryption Key</h3>
              <p className="text-sm text-gray-800 font-medium mb-4">
                <span className="font-black text-red-600">IMPORTANT:</span> This auto-generated key encrypts your file. 
                <span className="font-black"> Save it now!</span> TALA cannot recover lost keys.
              </p>
              
              {/* Key Display */}
              <div className="border-3 border-black p-4 bg-white mb-4 break-all font-mono text-sm">
                {form.decryptionKey}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyKeyToClipboard}
                  className={`px-4 py-3 border-3 border-black font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    keyCopied 
                      ? 'bg-heirlock-green text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {keyCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Key
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadKey}
                  className={`px-4 py-3 border-3 border-black font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    keyDownloaded 
                      ? 'bg-heirlock-green text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {keyDownloaded ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Key
                    </>
                  )}
                </button>
              </div>

              {/* Warning */}
              {!keyCopied && !keyDownloaded && (
                <div className="border-3 border-red-500 bg-red-50 p-3 mt-4">
                  <p className="text-xs font-black text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    You must copy or download this key before creating the vault!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {errors.decryptionKey && (
        <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal">
          <span className="text-sm text-red-600 font-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.decryptionKey}
          </span>
        </div>
      )}

      {/* Terms Acceptance */}
      <div className="border-4 border-black p-4 bg-gray-50">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => {
              setForm({ ...form, acceptTerms: e.target.checked });
              setErrors({ ...errors, acceptTerms: '' });
            }}
            className="mt-1 w-5 h-5 border-2 border-black"
          />
          <span className="text-sm text-gray-800 font-medium">
            I understand that <span className="font-black">I am solely responsible</span> for my decryption key. 
            TALA cannot recover lost keys or decrypt files. I accept the{' '}
            <a href="/terms" className="underline font-black hover:text-black" target="_blank" rel="noopener">
              Terms of Service
            </a>.
          </span>
        </label>
        {errors.acceptTerms && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1 mt-2">
            <AlertCircle className="w-3 h-3" />
            {errors.acceptTerms}
          </span>
        )}
      </div>

      {/* Error Messages */}
      {errors.submit && (
        <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal">
          <p className="text-sm text-red-700 font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errors.submit}</span>
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={form.isSubmitting}
        className={`w-full px-8 py-5 font-black border-4 border-black shadow-brutal inline-flex items-center justify-center gap-3 text-xl transition-all duration-200 ${
          form.isSubmitting
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-70'
            : demoMode
            ? 'bg-heirlock-green hover:bg-green-500 text-black hover:-translate-y-1 hover:shadow-brutal-lg'
            : 'bg-heirlock-yellow hover:bg-yellow-400 text-black hover:-translate-y-1 hover:shadow-brutal-lg'
        }`}
      >
        {form.isSubmitting ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            <span>Creating Vault...</span>
          </>
        ) : demoMode ? (
          <>
            <Zap className="w-6 h-6" />
            <span>Create Demo Vault (5 Min)</span>
          </>
        ) : (
          <>
            <Lock className="w-6 h-6" />
            <span>Create Time-Locked Vault</span>
          </>
        )}
      </button>

      {/* Security Info Footer */}
      <div className="border-2 border-black p-4 bg-white">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 font-medium space-y-1">
            <p><span className="font-black">Non-custodial:</span> Your file is encrypted on your device before upload.</p>
            <p><span className="font-black">Decentralized:</span> Stored on IPFS, accessible from anywhere.</p>
            <p><span className="font-black">Immutable:</span> Time-lock enforced by smart contract on Polygon blockchain.</p>
          </div>
        </div>
      </div>
    </form>

    {/* Progress Modal - Brutalist Design */}
    {showProgressModal && (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
        <div className="bg-cream border-8 border-black shadow-brutal max-w-lg w-full p-0 max-h-[90vh] overflow-y-auto">
          {/* Header - Bold Yellow Background */}
          <div className="bg-heirlock-yellow border-b-8 border-black p-8 space-y-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-black uppercase tracking-tight">Processing Vault</h2>
              <p className="text-sm font-black text-black opacity-70 uppercase tracking-wider">Securely creating and configuring your vault...</p>
            </div>

            {/* Main Progress Bar - Brutal Style */}
            <div className="space-y-2">
              <div className="h-4 bg-black border-2 border-black overflow-hidden relative" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
                <div 
                  className="h-full bg-heirlock-green transition-all duration-500 ease-out relative"
                  style={{
                    width: `${(processingSteps.filter(s => s.status === 'completed').length / processingSteps.length) * 100}%`
                  }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-black uppercase">
                  {processingSteps.filter(s => s.status === 'completed').length} of {processingSteps.length} steps completed
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-black text-heirlock-green">
                    {Math.round((processingSteps.filter(s => s.status === 'completed').length / processingSteps.length) * 100)}
                  </p>
                  <p className="text-xs font-black text-black">%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="border-b-8 border-black">
            {processingSteps.map((step, index) => {
              const isBlockchainStep = step.id === 'blockchain';
              const isError = step.status === 'error';
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';
              
              return (
                <div 
                  key={step.id} 
                  className={`border-b-4 border-black p-6 flex gap-4 transition-all duration-300 ${
                    isError 
                      ? 'bg-red-100' 
                      : isCompleted 
                      ? 'bg-heirlock-green' 
                      : isInProgress 
                      ? 'bg-heirlock-blue' 
                      : 'bg-white'
                  }`}
                >
                  {/* Status Indicator - Brutal Squares */}
                  <div className="shrink-0 flex-none">
                    {isCompleted && (
                      <div className="w-10 h-10 bg-black border-3 border-black flex items-center justify-center" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}>
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="w-10 h-10 bg-black border-3 border-black flex items-center justify-center" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}>
                        <Loader className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                    {isError && (
                      <div className="w-10 h-10 bg-red-600 border-3 border-black flex items-center justify-center" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}>
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {step.status === 'pending' && (
                      <div className="w-10 h-10 bg-gray-300 border-3 border-black" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-black text-black uppercase">
                        {step.label}
                      </p>
                      {isBlockchainStep && isInProgress && (
                        <span className="inline-flex items-center gap-1 bg-black text-heirlock-yellow px-3 py-1 font-black text-xs uppercase border-2 border-black" style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
                          <Zap className="w-3 h-3" />
                          Awaiting Wallet
                        </span>
                      )}
                    </div>
                    
                    {/* Gas Fee Display for Blockchain Step */}
                    {isBlockchainStep && step.gasFee && (
                      <p className="text-xs font-black text-black mb-2 bg-heirlock-yellow px-2 py-1 border-2 border-black inline-block uppercase">
                        <Zap className="w-3 h-3 inline mr-1" />
                        Estimated Gas: {step.gasFee}
                      </p>
                    )}

                    {/* Message */}
                    {step.message && (
                      <p className={`text-xs font-medium leading-relaxed ${
                        isError ? 'text-red-700 font-black' : 'text-gray-800'
                      }`}>
                        {step.message}
                      </p>
                    )}

                    {/* Timestamp */}
                    {step.timestamp && !isInProgress && (
                      <p className="text-xs text-gray-700 mt-2 font-mono">
                        {new Date(step.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Status Card - Brutal Design */}
          <div className={`border-b-8 border-black p-6 text-center font-black uppercase ${
            processingSteps.some(s => s.status === 'error')
              ? 'bg-red-100 text-red-900'
              : processingSteps.every(s => s.status === 'completed')
              ? 'bg-heirlock-yellow text-black'
              : 'bg-heirlock-blue text-black'
          }`}>
            <p className="text-lg tracking-wider">
              {processingSteps.some(s => s.status === 'error')
                ? '✗ Error - Please review and try again'
                : processingSteps.every(s => s.status === 'completed')
                ? '✓ Vault created and verified!'
                : `⏳ Processing...`
              }
            </p>
          </div>

          {/* Action Buttons - Brutal Style */}
          <div className="flex">
            {processingSteps.some(s => s.status === 'error') && (
              <>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 px-6 py-4 border-r-4 border-black bg-white text-black font-black text-sm uppercase hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowProgressModal(false);
                    setErrors({});
                  }}
                  className="flex-1 px-6 py-4 bg-black text-heirlock-yellow font-black text-sm uppercase hover:bg-gray-900 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
            {!processingSteps.some(s => s.status === 'error') && 
             processingSteps.every(s => s.status === 'completed') && (
              <button
                onClick={() => setShowProgressModal(false)}
                className="w-full px-6 py-4 bg-black text-heirlock-yellow font-black text-sm uppercase hover:bg-gray-900 transition-colors"
              >
                Done - View Vault
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}


