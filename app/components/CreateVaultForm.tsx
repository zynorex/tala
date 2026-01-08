'use client';

import { useState, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Lock, Upload, FileText, AlertCircle, CheckCircle, Loader, Calendar, Eye, EyeOff, Info, Shield, Clock, X } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useRouter } from 'next/navigation';
import { validators } from '@/lib/validators/input-validators';

interface FormState {
  vaultName: string;
  vaultDescription: string;
  file: File | null;
  password: string;
  confirmPassword: string;
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

export default function CreateVaultForm() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Date constraints
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  const [form, setForm] = useState<FormState>({
    vaultName: '',
    vaultDescription: '',
    file: null,
    password: '',
    confirmPassword: '',
    unlockDate: '',
    unlockTime: '12:00',
    isSubmitting: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Too weak',
    color: 'bg-red-500',
    suggestions: [],
  });
  const [dragActive, setDragActive] = useState(false);

  // Password strength checker
  const checkPasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length === 0) {
      return { score: 0, label: 'Too weak', color: 'bg-gray-300', suggestions: ['Enter a password'] };
    }

    if (password.length >= 8) score++;
    else suggestions.push('Use at least 8 characters');

    if (password.length >= 12) score++;
    else if (password.length >= 8) suggestions.push('Use 12+ characters for better security');

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push('Include both uppercase and lowercase letters');

    if (/\d/.test(password)) score++;
    else suggestions.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else suggestions.push('Include special characters (!@#$%^&*)');

    if (/^(123|abc|qwe|password|admin)/i.test(password)) {
      score = Math.max(0, score - 2);
      suggestions.push('Avoid common patterns');
    }

    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

    return {
      score: Math.min(score, 4),
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)],
      suggestions,
    };
  }, []);

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
    const sizeValidation = validators.fileSize(file.size, 500 * 1024 * 1024);
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

    setForm({ ...form, file });
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

    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak. Please use a stronger password.';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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

    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast('Please connect your wallet first', 'error');
      return;
    }

    if (!validateForm()) {
      toast('Please fix all errors before submitting', 'error');
      return;
    }

    setForm({ ...form, isSubmitting: true });

    try {
      // Step 1: Create vault
      const unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`);
      const unlockTimestamp = Math.floor(unlockDateTime.getTime() / 1000);

      const createRes = await fetch('/api/vaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.vaultName,
          description: form.vaultDescription,
          password: form.password,
          unlockTime: unlockTimestamp,
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error || 'Failed to create vault');
      }

      const vaultData = await createRes.json();
      const vaultId = vaultData.data?.id;

      if (!vaultId) {
        throw new Error('No vault ID returned from server');
      }

      toast('Vault created! Encrypting and uploading file...', 'info');

      // Step 2: Upload file
      const formData = new FormData();
      if (form.file) {
        formData.append('file', form.file);
      }
      formData.append('encryptionPassword', form.password);
      formData.append('vaultId', vaultId);

      const uploadRes = await fetch('/api/vaults/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      toast('Vault created and file encrypted successfully!', 'success');

      // Reset form
      setForm({
        vaultName: '',
        vaultDescription: '',
        file: null,
        password: '',
        confirmPassword: '',
        unlockDate: '',
        unlockTime: '12:00',
        isSubmitting: false,
        acceptTerms: false,
      });
      setErrors({});
      setPasswordStrength({
        score: 0,
        label: 'Too weak',
        color: 'bg-red-500',
        suggestions: [],
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to vault
      setTimeout(() => {
        router.push(`/vault/${vaultId}`);
      }, 2000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vault';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="border-4 border-black p-6 bg-heirlock-blue shadow-brutal">
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
          File to Encrypt * (Max 500 MB)
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
                    Size: {(form.file.size / 1024 / 1024).toFixed(2)} MB / 500 MB
                  </p>
                  <div className="w-full bg-gray-300 border-2 border-black h-3 rounded-sm overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        form.file.size > 500 * 1024 * 1024 ? 'bg-red-500' : 'bg-heirlock-green'
                      }`}
                      style={{ width: `${Math.min((form.file.size / (500 * 1024 * 1024)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm({ ...form, file: null });
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
                <p className="text-xs text-gray-600 font-medium mt-2">Maximum file size: 500 MB</p>
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
      </div>

      {/* Unlock Date & Time */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Clock className="w-4 h-4 inline mr-2" />
          Unlock Date & Time *
        </label>
        <p className="text-xs text-gray-700 font-medium mb-3">
          Choose when the vault will unlock. Can be from 1 minute to 100 years in the future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={form.unlockDate}
              onChange={(e) => {
                setForm({ ...form, unlockDate: e.target.value });
                setErrors({ ...errors, unlockDate: '' });
              }}
              className={`w-full px-4 py-3 border-4 border-black bg-cream font-medium text-black focus:outline-none focus:ring-4 focus:ring-black/20 ${
                errors.unlockDate ? 'ring-4 ring-red-500' : ''
              }`}
            />
          </div>
          <div>
            <input
              type="time"
              value={form.unlockTime}
              onChange={(e) => {
                setForm({ ...form, unlockTime: e.target.value });
                setErrors({ ...errors, unlockDate: '' });
              }}
              className={`w-full px-4 py-3 border-4 border-black bg-cream font-medium text-black focus:outline-none focus:ring-4 focus:ring-black/20 ${
                errors.unlockDate ? 'ring-4 ring-red-500' : ''
              }`}
            />
          </div>
        </div>
        {form.unlockDate && form.unlockTime && (
          <div className="border-2 border-black p-3 bg-heirlock-yellow">
            <p className="text-sm font-bold text-black">
              Vault will unlock on: {new Date(`${form.unlockDate}T${form.unlockTime}`).toLocaleString()}
            </p>
          </div>
        )}
        {errors.unlockDate && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.unlockDate}
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
          This password encrypts your file. <span className="font-black text-red-600">NEVER share or lose this password!</span> It cannot be recovered.
        </p>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => {
              const newPassword = e.target.value;
              setForm({ ...form, password: newPassword });
              setPasswordStrength(checkPasswordStrength(newPassword));
              setErrors({ ...errors, password: '' });
            }}
            placeholder="Enter a strong password"
            className={`w-full px-4 py-3 pr-12 border-4 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-black/20 ${
              errors.password ? 'ring-4 ring-red-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {form.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-300 border-2 border-black rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-black">{passwordStrength.label}</span>
            </div>
            {passwordStrength.suggestions.length > 0 && (
              <div className="border-2 border-orange-500 bg-orange-50 p-3">
                <p className="text-xs font-black text-orange-800 mb-1">Suggestions:</p>
                <ul className="text-xs text-orange-700 font-medium space-y-1 list-disc list-inside">
                  {passwordStrength.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {errors.password && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="Re-enter your password"
            className={`w-full px-4 py-3 pr-12 border-4 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-black/20 ${
              errors.confirmPassword ? 'ring-4 ring-red-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {form.confirmPassword && form.password === form.confirmPassword && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-black">Passwords match</span>
          </div>
        )}
        {errors.confirmPassword && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword}
          </span>
        )}
      </div>

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
            I understand that <span className="font-black">I am solely responsible</span> for my encryption password. 
            TALA cannot recover lost passwords or decrypt files. I accept the{' '}
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
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-black text-heirlock-yellow hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        }`}
      >
        {form.isSubmitting ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            <span>Creating Vault & Encrypting...</span>
          </>
        ) : (
          <>
            <Lock className="w-6 h-6" />
            <span>Create Secure Vault</span>
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
  );
}
