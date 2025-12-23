'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Lock, Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useRouter } from 'next/navigation';
import { validators } from '@/lib/validators/input-validators';

interface FormState {
  vaultName: string;
  vaultDescription: string;
  file: File | null;
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function CreateVaultForm() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    vaultName: '',
    vaultDescription: '',
    file: null,
    password: '',
    confirmPassword: '',
    isSubmitting: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [vaultId, setVaultId] = useState<string | null>(null);

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeValidation = validators.fileSize(file.size);
      if (!sizeValidation.valid) {
        setErrors({ ...errors, file: sizeValidation.error || 'File size invalid' });
        toast(sizeValidation.error || 'File size invalid', 'error');
        return;
      }

      setForm({ ...form, file });
      setErrors({ ...errors, file: '' });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Vault name
    if (!form.vaultName.trim()) {
      newErrors.vaultName = 'Vault name is required';
    }

    // File
    if (!form.file) {
      newErrors.file = 'Please select a file to encrypt';
    }

    // Password strength
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password match
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Create vault
  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast('Please connect your wallet first', 'error');
      return;
    }

    if (!form.vaultName.trim()) {
      setErrors({ ...errors, vaultName: 'Vault name is required' });
      return;
    }

    setForm({ ...form, isSubmitting: true });

    try {
      // Create vault via API
      const createRes = await fetch('/api/vaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.vaultName,
          description: form.vaultDescription,
          password: form.password || 'default',
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error || 'Failed to create vault');
      }

      const data = await createRes.json();
      const newVaultId = data.data?.id;

      if (!newVaultId) {
        throw new Error('No vault ID returned from server');
      }

      setVaultId(newVaultId);
      toast('Vault created successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vault';
      toast(message, 'error');
      setErrors({ submit: message });
    } finally {
      setForm({ ...form, isSubmitting: false });
    }
  };

  // Step 2: Upload file to vault
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!vaultId) {
      setErrors({ submit: 'Vault ID not found' });
      return;
    }

    setForm({ ...form, isSubmitting: true });

    try {
      const formData = new FormData();
      if (form.file) {
        formData.append('file', form.file);
      }
      formData.append('password', form.password);
      formData.append('vaultId', vaultId);

      toast('Encrypting and uploading file...', 'info');

      const uploadRes = await fetch('/api/vaults/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      toast('File uploaded and encrypted successfully!', 'success');

      // Reset form and redirect
      setForm({
        vaultName: '',
        vaultDescription: '',
        file: null,
        password: '',
        confirmPassword: '',
        isSubmitting: false,
      });
      setVaultId(null);
      setErrors({});

      // Redirect to vault detail page
      setTimeout(() => {
        router.push(`/vault/${vaultId}`);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      toast(message, 'error');
      setErrors({ submit: message });
    } finally {
      setForm({ ...form, isSubmitting: false });
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

  // If vault not created yet, show vault creation form
  if (!vaultId) {
    return (
      <form onSubmit={handleCreateVault} className="space-y-6">
        {/* Security Notice */}
        <div className="border-4 border-black p-6 bg-heirlock-pink shadow-brutal">
          <h3 className="font-black text-black text-lg mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Step 1: Create Vault
          </h3>
          <p className="text-sm text-gray-800 font-medium">
            Start by creating a new vault to store your encrypted files.
          </p>
        </div>

        {/* Vault Name */}
        <div className="space-y-2">
          <label className="font-black text-black text-sm uppercase block">
            Vault Name *
          </label>
          <input
            type="text"
            maxLength={256}
            value={form.vaultName}
            onChange={(e) => {
              setForm({ ...form, vaultName: e.target.value });
              setErrors({ ...errors, vaultName: '' });
            }}
            placeholder="e.g., 'Important Documents 2025'"
            className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              errors.vaultName ? 'ring-2 ring-red-500' : ''
            }`}
          />
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
            maxLength={512}
            value={form.vaultDescription}
            onChange={(e) => {
              setForm({ ...form, vaultDescription: e.target.value });
              setErrors({ ...errors, vaultDescription: '' });
            }}
            placeholder="What is this vault for?"
            className="w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            rows={3}
          />
        </div>

        {/* Error Messages */}
        {errors.submit && (
          <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal max-h-32 overflow-y-auto">
            <p className="text-sm text-red-700 font-medium flex items-start gap-2 break-words">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{errors.submit}</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={form.isSubmitting}
          className={`w-full px-8 py-4 font-black border-4 border-black shadow-brutal inline-flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
            form.isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-black text-heirlock-yellow hover:translate-y-[-3px] hover:shadow-lg'
          }`}
        >
          {form.isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Creating Vault...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Create Vault</span>
            </>
          )}
        </button>
      </form>
    );
  }

  // Vault created, now show file upload form
  return (
    <form onSubmit={handleUploadFile} className="space-y-6">
      {/* Success Notice */}
      <div className="border-4 border-green-600 p-6 bg-green-50 shadow-brutal">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-green-900 text-lg mb-2">Vault Created!</h3>
            <p className="text-sm text-green-800 font-medium">
              Your vault ID: <code className="font-mono">{vaultId}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 Notice */}
      <div className="border-4 border-black p-6 bg-heirlock-yellow shadow-brutal">
        <h3 className="font-black text-black text-lg mb-3 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Step 2: Upload & Encrypt File
        </h3>
        <p className="text-sm text-gray-800 font-medium">
          Upload your file with a secure encryption password.
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Upload className="w-4 h-4 inline mr-2" />
          File to Encrypt * (Max 500 MB)
        </label>
        <div className="border-4 border-dashed border-black p-6 bg-cream hover:bg-gray-50 transition-colors cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={form.isSubmitting}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {form.file ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-black text-black mb-1">{form.file.name}</p>
                  <p className="text-xs text-gray-700 font-medium mb-3">
                    Size: {(form.file.size / 1024 / 1024).toFixed(2)} MB / 500 MB
                  </p>
                  <div className="w-full bg-gray-300 border-2 border-black h-2">
                    <div
                      className="h-full bg-heirlock-green transition-all duration-300"
                      style={{ width: `${Math.min((form.file.size / (500 * 1024 * 1024)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-4" />
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="font-black text-black mb-1">Click to select file</p>
                <p className="text-xs text-gray-600 font-medium">or drag and drop</p>
                <p className="text-xs text-gray-500 font-medium mt-2">Maximum file size: 500 MB</p>
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

      {/* Encryption Password */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Lock className="w-4 h-4 inline mr-2" />
          Encryption Password *
        </label>
        <p className="text-xs text-gray-700 font-medium mb-3">
          Create a strong password to encrypt your file. You'll need this to download and decrypt later.
        </p>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter encryption password (min 8 characters)"
              className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black pr-12 ${
                errors.password ? 'ring-2 ring-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="Confirm encryption password"
            className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              errors.confirmPassword ? 'ring-2 ring-red-500' : ''
            }`}
          />
        </div>
        {errors.password && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </span>
        )}
        {errors.confirmPassword && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Error Messages */}
      {errors.submit && (
        <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal max-h-32 overflow-y-auto">
          <p className="text-sm text-red-700 font-medium flex items-start gap-2 break-words">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{errors.submit}</span>
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={form.isSubmitting || !form.file || form.password.length < 8}
        className={`w-full px-8 py-4 font-black border-4 border-black shadow-brutal inline-flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
          form.isSubmitting || !form.file || form.password.length < 8
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-black text-heirlock-yellow hover:translate-y-[-3px] hover:shadow-lg'
        }`}
      >
        {form.isSubmitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Uploading & Encrypting...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Upload File to Vault</span>
          </>
        )}
      </button>

      {/* Info Box */}
      <div className="border-4 border-black p-6 bg-heirlock-green shadow-brutal">
        <h4 className="font-black text-black text-sm uppercase mb-3">Important</h4>
        <ul className="space-y-2 text-xs text-gray-800 font-medium">
          <li>• Your file will be encrypted with AES-256-GCM</li>
          <li>• Save your encryption password somewhere secure</li>
          <li>• You will need this password to download and decrypt your file</li>
          <li>• If you forget the password, the file cannot be recovered</li>
          <li>• Your encryption key never leaves your browser</li>
        </ul>
      </div>
    </form>
  );
}
