import { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

interface PasswordPromptModalProps {
  isOpen: boolean;
  fileName: string;
  isLoading: boolean;
  progress: number;
  error?: string | null;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

/**
 * Password Prompt Modal
 * Enterprise-grade modal for secure password entry
 * Features:
 * - Secure password input with visibility toggle
 * - Real-time progress indication
 * - Error display with helpful messages
 * - Keyboard shortcuts (Enter = confirm, Esc = cancel)
 * - Loading state during decryption
 * - Accessibility features (ARIA labels)
 */
export function PasswordPromptModal({
  isOpen,
  fileName,
  isLoading,
  progress,
  error,
  onConfirm,
  onCancel
}: PasswordPromptModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleConfirm = () => {
    // Clear previous errors
    setLocalError(null);

    // Validate password
    if (!password || password.trim().length === 0) {
      setLocalError('Password is required');
      return;
    }

    // Call parent handler
    onConfirm(password);
  };

  const handleCancel = () => {
    setPassword('');
    setShowPassword(false);
    setLocalError(null);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Don't render if closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="border-4 border-black bg-white p-8 max-w-md w-full shadow-brutal">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded flex-shrink-0">
            <Lock className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-black">Decrypt File</h2>
            <p className="text-xs text-gray-600 mt-1">This vault is encrypted. Enter the password to decrypt.</p>
          </div>
        </div>

        {/* File Info */}
        <div className="border-2 border-gray-300 bg-gray-50 p-3 rounded mb-6">
          <p className="text-xs font-black text-gray-600 mb-1">FILE</p>
          <p className="text-sm font-mono truncate text-black">{fileName}</p>
        </div>

        {/* Loading/Progress */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-gray-600">DECRYPTING</p>
              <p className="text-xs font-mono font-black">{progress}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 border-2 border-black">
              <div
                className="h-full bg-heirlock-green transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {progress < 40 && 'Fetching file from IPFS...'}
              {progress >= 40 && progress < 70 && 'Decrypting file...'}
              {progress >= 70 && 'Verifying integrity...'}
              {progress === 100 && 'Download starting...'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {(error || localError) && !isLoading && (
          <div className="mb-6 border-2 border-red-500 bg-red-50 p-3 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-semibold">{error || localError}</p>
            </div>
          </div>
        )}

        {/* Password Input */}
        <div className="mb-6">
          <label className="text-xs font-black text-gray-600 block mb-2">PASSWORD</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError(null); // Clear error when user starts typing
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter vault password"
              disabled={isLoading}
              autoFocus
              className="w-full px-4 py-3 border-3 border-black font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Vault password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || !password}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 border-2 border-heirlock-blue p-3 rounded mb-6">
          <p className="text-xs font-bold text-heirlock-blue">
            🔒 <strong>AES-256-GCM Encrypted</strong>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Your password is used only for decryption. It's never sent to our servers.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 border-4 border-black bg-gray-200 text-black p-3 font-black text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !password}
            className="flex-1 border-4 border-heirlock-green bg-heirlock-green text-white p-3 font-black text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Decrypting...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Decrypt & Download
              </>
            )}
          </button>
        </div>

        {/* Footer Help Text */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Tip: Press <kbd className="bg-gray-100 px-1 py-0.5 rounded">Enter</kbd> to decrypt or <kbd className="bg-gray-100 px-1 py-0.5 rounded">Esc</kbd> to cancel
        </p>
      </div>
    </div>
  );
}

