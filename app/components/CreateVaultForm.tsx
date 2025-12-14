'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Lock, Upload, Calendar, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useVaultContract } from '@/app/hooks/useVaultContract';
import { encrypt, generateEncryptionKey, hashEncryptionKey } from '@/lib/crypto/encryption';
import { uploadToIPFS } from '@/lib/ipfs/ipfs';
import { validateVaultCreation, validators } from '@/lib/validators/input-validators';

interface FormState {
  description: string;
  unlockDate: string;
  unlockTime: string;
  file: File | null;
  isSubmitting: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function CreateVaultForm() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const { createVault, isCreatePending, error: contractError } = useVaultContract();

  const [form, setForm] = useState<FormState>({
    description: '',
    unlockDate: '',
    unlockTime: '',
    file: null,
    isSubmitting: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Generate encryption password helper
  const generatePassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEncryptionPassword(password);
    toast('success', 'Encryption password generated. Save it securely!');
  }, [toast]);

  // Copy password to clipboard
  const copyPassword = useCallback(() => {
    if (encryptionPassword) {
      navigator.clipboard.writeText(encryptionPassword);
      toast('success', 'Password copied to clipboard');
    }
  }, [encryptionPassword, toast]);

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeValidation = validators.fileSize(file.size);
      if (!sizeValidation.valid) {
        setErrors({ ...errors, file: sizeValidation.error });
        toast('error', sizeValidation.error || 'File size invalid');
        return;
      }

      setForm({ ...form, file });
      setErrors({ ...errors, file: '' });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Description
    const descValidation = validators.description(form.description);
    if (!descValidation.valid) {
      newErrors.description = descValidation.error || 'Invalid description';
    }

    // File
    if (!form.file) {
      newErrors.file = 'Please select a file to encrypt';
    }

    // Unlock date/time
    if (!form.unlockDate || !form.unlockTime) {
      newErrors.unlockTime = 'Please select unlock date and time';
    } else {
      const unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`).getTime() / 1000;
      const timeValidation = validators.unlockTime(unlockDateTime);
      if (!timeValidation.valid) {
        newErrors.unlockTime = timeValidation.error || 'Invalid unlock time';
      }
    }

    // Encryption password
    const passwordValidation = validators.passwordStrength(encryptionPassword);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || 'Password is too weak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast('error', 'Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setForm({ ...form, isSubmitting: true });

    try {
      // Read and encrypt file
      if (!form.file) throw new Error('File is required');

      const fileBuffer = await form.file.arrayBuffer();
      const fileUint8Array = new Uint8Array(fileBuffer);

      // Generate encryption key
      const encryptionKey = generateEncryptionKey();

      // Encrypt file
      toast('info', 'Encrypting file...');
      const encrypted = encrypt(Buffer.from(fileUint8Array), encryptionKey);

      // Upload to IPFS
      toast('info', 'Uploading to IPFS...');
      const encryptedBuffer = Buffer.from(encrypted.ciphertext, 'hex');
      const ipfsResult = await uploadToIPFS(encryptedBuffer, form.file.name, form.description);

      // Hash encryption key for on-chain storage
      const keyHash = hashEncryptionKey(encryptionKey);

      // Calculate unlock timestamp
      const unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`).getTime() / 1000;

      // Create vault on blockchain
      toast('info', 'Creating vault on blockchain...');
      await createVault(
        ipfsResult.ipfsHash,
        keyHash as `0x${string}`,
        Math.floor(unlockDateTime),
        form.description,
        form.file.size
      );

      toast('success', 'Vault created successfully!');

      // Store encrypted key locally (user responsibility)
      const vaultKeyData = {
        encryptionKey: encryptionKey.toString('hex'),
        encryptedData: encrypted,
        ipfsHash: ipfsResult.ipfsHash,
        filename: form.file.name,
        createdAt: new Date().toISOString(),
      };

      // Log for user to save
      console.log('Save this encryption key safely:', vaultKeyData);

      // Reset form
      setForm({
        description: '',
        unlockDate: '',
        unlockTime: '',
        file: null,
        isSubmitting: false,
      });
      setEncryptionPassword('');
      setErrors({});
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create vault';
      toast('error', errorMsg);
      setErrors({ submit: errorMsg });
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
      <div className="border-4 border-black p-6 bg-heirlock-pink shadow-brutal">
        <h3 className="font-black text-black text-lg mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Security Notice
        </h3>
        <ul className="space-y-2 text-sm text-gray-800 font-medium">
          <li>✓ Your file will be encrypted with AES-256-GCM before uploading</li>
          <li>✓ Only you have access to the decryption key</li>
          <li>✓ Save your encryption key in a secure location</li>
          <li>✓ Without the key, your vault cannot be accessed</li>
        </ul>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          Vault Description *
        </label>
        <input
          type="text"
          maxLength={256}
          value={form.description}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            setErrors({ ...errors, description: '' });
          }}
          placeholder="What is this vault for? (e.g., 'Important documents 2025')"
          className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
            errors.description ? 'ring-2 ring-red-500' : ''
          }`}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-700 font-medium">
            {form.description.length}/256 characters
          </span>
          {errors.description && (
            <span className="text-xs text-red-600 font-black flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.description}
            </span>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Upload className="w-4 h-4 inline mr-2" />
          File to Encrypt *
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
                <div>
                  <p className="font-black text-black mb-1">{form.file.name}</p>
                  <p className="text-xs text-gray-700 font-medium">
                    Size: {(form.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-black mx-auto mb-2" />
                <p className="font-black text-black mb-1">Click to select file</p>
                <p className="text-xs text-gray-700 font-medium">Max 500 MB</p>
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

      {/* Encryption Key Management */}
      <div className="space-y-2">
        <label className="font-black text-black text-sm uppercase block">
          <Lock className="w-4 h-4 inline mr-2" />
          Encryption Key (Generated Automatically) *
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={generatePassword}
            className="w-full px-4 py-3 bg-black text-heirlock-yellow font-black border-3 border-black shadow-brutal hover:translate-y-[-2px] transition-all duration-200"
          >
            Generate Secure Encryption Key
          </button>

          {encryptionPassword && (
            <div className="border-3 border-black p-4 bg-cream space-y-2">
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-black break-all">
                  {showPassword ? encryptionPassword : '•'.repeat(32)}
                </code>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-black text-black underline ml-2"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <button
                type="button"
                onClick={copyPassword}
                className="w-full px-3 py-2 bg-white text-black font-black border-2 border-black text-xs hover:bg-gray-50 transition-colors"
              >
                Copy Key
              </button>
            </div>
          )}
        </div>
        {errors.password && (
          <span className="text-xs text-red-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </span>
        )}
      </div>

      {/* Unlock Date/Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-black text-black text-sm uppercase block">
            <Calendar className="w-4 h-4 inline mr-2" />
            Unlock Date *
          </label>
          <input
            type="date"
            value={form.unlockDate}
            onChange={(e) => {
              setForm({ ...form, unlockDate: e.target.value });
              setErrors({ ...errors, unlockTime: '' });
            }}
            className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              errors.unlockTime ? 'ring-2 ring-red-500' : ''
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="font-black text-black text-sm uppercase block">
            Unlock Time (UTC) *
          </label>
          <input
            type="time"
            value={form.unlockTime}
            onChange={(e) => {
              setForm({ ...form, unlockTime: e.target.value });
              setErrors({ ...errors, unlockTime: '' });
            }}
            className={`w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              errors.unlockTime ? 'ring-2 ring-red-500' : ''
            }`}
          />
        </div>
      </div>
      {errors.unlockTime && (
        <span className="text-xs text-red-600 font-black flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.unlockTime}
        </span>
      )}

      {/* Error Messages */}
      {(errors.submit || contractError) && (
        <div className="border-4 border-red-500 p-4 bg-red-50 shadow-brutal">
          <p className="text-sm text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.submit || contractError}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={form.isSubmitting || isCreatePending || !encryptionPassword}
        className={`w-full px-8 py-4 font-black border-4 border-black shadow-brutal inline-flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
          form.isSubmitting || isCreatePending || !encryptionPassword
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-black text-heirlock-yellow hover:translate-y-[-3px] hover:shadow-lg'
        }`}
      >
        {form.isSubmitting || isCreatePending ? (
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

      {/* Info Box */}
      <div className="border-4 border-black p-6 bg-heirlock-green shadow-brutal">
        <h4 className="font-black text-black text-sm uppercase mb-3">Important</h4>
        <ul className="space-y-2 text-xs text-gray-800 font-medium">
          <li>• Save your encryption key somewhere secure (password manager, offline storage)</li>
          <li>• You will need this key to decrypt and access your vault contents</li>
          <li>• If you lose the key, your vault contents cannot be recovered</li>
          <li>• Vault creation costs a small gas fee on Polygon network</li>
        </ul>
      </div>
    </form>
  );
}
