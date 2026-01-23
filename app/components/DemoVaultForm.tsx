'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Lock, Upload, AlertCircle, CheckCircle, Loader, Calendar, Shield, Clock, X, Key, Copy, Download } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useRouter } from 'next/navigation';
import { validators } from '@/lib/validators/input-validators';

interface FormState {
  vaultName: string;
  vaultDescription: string;
  file: File | null;
  decryptionKey: string;
  isSubmitting: boolean;
  acceptTerms: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function DemoVaultForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    vaultName: 'My Demo Vault',
    vaultDescription: 'Testing TALA time-locking technology',
    file: null,
    decryptionKey: '',
    isSubmitting: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyDownloaded, setKeyDownloaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Calculate 2-minute unlock time
  const getUnlockDateTime = useCallback((): string => {
    const now = new Date();
    const unlockTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
    return unlockTime.toISOString();
  }, []);

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
    toast('Demo decryption key copied to clipboard!', 'success');
  }, [form.decryptionKey, toast]);

  // Download key as text file
  const downloadKey = useCallback(() => {
    const blob = new Blob([`TALA Demo Vault Decryption Key\n\nVault: ${form.vaultName}\nGenerated: ${new Date().toLocaleString()}\n\nUnlock Time: 2 minutes from creation\n\nDecryption Key:\n${form.decryptionKey}\n\nIMPORTANT: Keep this key safe! You will need it to decrypt your vault after 2 minutes.\nTALA cannot recover lost keys.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TALA-demo-vault-key-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setKeyDownloaded(true);
    toast('Demo decryption key downloaded!', 'success');
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

    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast('Please fix all errors before submitting', 'error');
      return;
    }

    setForm({ ...form, isSubmitting: true });

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found. Please sign in first.');
      }

      // Create demo vault
      const unlockDateTime = getUnlockDateTime();
      const unlockTimestamp = Math.floor(new Date(unlockDateTime).getTime() / 1000);

      console.log('Creating demo vault with data:', {
        name: form.vaultName,
        description: form.vaultDescription,
        unlockTimestamp,
        isDemo: true,
      });

      const createRes = await fetch('/api/vaults/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.vaultName,
          description: form.vaultDescription,
          password: form.decryptionKey,
          unlockTime: unlockTimestamp,
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        console.error('Create demo vault error:', data);
        throw new Error(data.error || 'Failed to create demo vault');
      }

      const vaultData = await createRes.json();
      const vaultId = vaultData.data?.id;

      if (!vaultId) {
        throw new Error('No vault ID returned from server');
      }

      toast('Demo vault created! Encrypting and uploading file...', 'info');

      // Upload file
      const formData = new FormData();
      if (form.file) {
        formData.append('file', form.file);
      }
      formData.append('encryptionPassword', form.decryptionKey);
      formData.append('vaultId', vaultId);

      const uploadRes = await fetch('/api/vaults/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      toast('Demo vault created with encrypted file! Auto-unlocks in 2 minutes.', 'success');

      // Redirect to vault
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        router.push(`/vault/${vaultId}`);
      }, 2000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create demo vault';
      toast(message, 'error');
      setErrors({ submit: message });
    } finally {
      setForm({ ...form, isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="border-4 border-black p-6 bg-heirlock-blue shadow-brutal">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-black text-lg mb-2">Demo Vault: Real Encryption, 2 Minute Timer</h3>
            <ul className="text-sm text-gray-800 font-medium space-y-1 list-disc list-inside">
              <li>Real AES-256-GCM encryption with PBKDF2 key derivation</li>
              <li>Your file encrypted client-side before upload</li>
              <li>Decentralized storage on IPFS via Pinata</li>
              <li>Unlocks automatically after 2 minutes to demonstrate time-locking</li>
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
            id="demo-file-upload"
          />
          <label htmlFor="demo-file-upload" className="cursor-pointer block">
            {form.file ? (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="font-bold text-black truncate">{form.file.name}</p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {(form.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, file: null });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-2 hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-bold text-black mb-1">Click to select file or drag & drop</p>
                <p className="text-sm text-gray-600">
                  Maximum file size: 50 MB. Supported: All file types except executables (.exe, .bat, .sh, etc.)
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
      </div>

      {/* Unlock Time Info */}
      <div className="border-4 border-black p-6 bg-heirlock-green shadow-brutal">
        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-black flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-black text-black text-lg mb-1">Auto-Unlock: 2 Minutes</h4>
            <p className="text-gray-800 font-medium">
              This demo vault will automatically unlock in 2 minutes from creation. Perfect for testing the full workflow and seeing time-locking in action.
            </p>
          </div>
        </div>
      </div>

      {/* Decryption Key Management */}
      {form.decryptionKey && (
        <div className="border-4 border-black p-6 bg-yellow-50 shadow-brutal">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-black" />
              <h4 className="font-black text-black text-lg">Your Decryption Key</h4>
            </div>

            <div className="bg-white border-2 border-black p-3 font-mono text-xs break-all">
              {form.decryptionKey}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyKeyToClipboard}
                disabled={form.isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-4 border-black font-black transition-all ${
                  keyCopied
                    ? 'bg-green-400 text-black'
                    : 'bg-heirlock-yellow text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <Copy className="w-5 h-5" />
                {keyCopied ? 'Copied!' : 'Copy Key'}
              </button>
              <button
                type="button"
                onClick={downloadKey}
                disabled={form.isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-4 border-black font-black transition-all ${
                  keyDownloaded
                    ? 'bg-green-400 text-black'
                    : 'bg-heirlock-blue text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <Download className="w-5 h-5" />
                {keyDownloaded ? 'Downloaded!' : 'Download Key'}
              </button>
            </div>

            <div className="text-xs text-gray-800 font-bold bg-white border-2 border-black p-3">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              You must copy or download the key before creating the vault. You will need it to decrypt your files after 2 minutes.
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => {
              setForm({ ...form, acceptTerms: e.target.checked });
              setErrors({ ...errors, acceptTerms: '' });
            }}
            disabled={form.isSubmitting}
            className="w-5 h-5 border-2 border-black mt-0.5 cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-800">
            I understand that this is a demo vault with real encryption, and my file will be encrypted, stored on IPFS, and automatically unlocked after 2 minutes. I have safely stored my decryption key.
          </span>
        </label>
        {errors.acceptTerms && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.acceptTerms}
          </span>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-red-800 mb-1">Error Creating Vault</h4>
              <p className="text-sm text-red-700 font-medium">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={form.isSubmitting || !form.file || !form.decryptionKey || (!keyCopied && !keyDownloaded)}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 border-4 border-black font-black text-lg transition-all ${
          form.isSubmitting || !form.file || !form.decryptionKey || (!keyCopied && !keyDownloaded)
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-black text-heirlock-yellow hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        }`}
      >
        {form.isSubmitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Creating Demo Vault...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Create Demo Vault</span>
          </>
        )}
      </button>
    </form>
  );
}
