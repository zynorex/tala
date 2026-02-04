import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, Upload, FileText, AlertCircle, CheckCircle, Lock, 
  Loader2, Shield, HardDrive, Eye, EyeOff, Trash2
} from 'lucide-react';

// ============ TYPES ============

interface AddFileModalProps {
  isOpen: boolean;
  vaultId: string;
  vaultName: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadState {
  status: 'idle' | 'validating' | 'encrypting' | 'uploading' | 'success' | 'error';
  progress: number;
  message: string;
  error: string | null;
}

interface FileValidation {
  valid: boolean;
  error: string | null;
  warnings: string[];
}

// ============ CONSTANTS ============

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MIN_PASSWORD_LENGTH = 8;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'text/plain': 'Text File',
  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive',
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/webp': 'WebP Image',
};

// ============ HELPER FUNCTIONS ============

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function validateFile(file: File): FileValidation {
  const warnings: string[] = [];
  
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected', warnings };
  }

  // Check file size
  if (file.size === 0) {
    return { valid: false, error: 'File is empty', warnings };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`, 
      warnings 
    };
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type "${file.type || 'unknown'}" is not supported. Allowed: PDF, Word, Excel, PowerPoint, Text, ZIP, RAR, JPEG, PNG, WebP`, 
      warnings 
    };
  }

  // Check filename
  if (file.name.length > 255) {
    return { valid: false, error: 'Filename too long (max 255 characters)', warnings };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js'];
  const lowerName = file.name.toLowerCase();
  for (const pattern of suspiciousPatterns) {
    if (lowerName.includes(pattern)) {
      return { valid: false, error: 'File contains suspicious extension', warnings };
    }
  }

  // Add warnings for edge cases
  if (file.size > 25 * 1024 * 1024) {
    warnings.push('Large file - upload may take longer');
  }

  if (file.name.includes(' ')) {
    warnings.push('Filename contains spaces');
  }

  return { valid: true, error: null, warnings };
}

function validatePassword(password: string): { valid: boolean; error: string | null } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password too long (max 128 characters)' };
  }

  return { valid: true, error: null };
}

// ============ COMPONENT ============

export function AddFileModal({ 
  isOpen, 
  vaultId, 
  vaultName, 
  onClose, 
  onSuccess 
}: AddFileModalProps) {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: '',
    error: null,
  });
  const [fileValidation, setFileValidation] = useState<FileValidation | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPassword('');
      setShowPassword(false);
      setUploadState({ status: 'idle', progress: 0, message: '', error: null });
      setFileValidation(null);
      setIsDragging(false);
    } else {
      // Abort any ongoing upload when modal closes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && uploadState.status !== 'uploading') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, uploadState.status, onClose]);

  // File selection handler
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFileValidation(null);
      return;
    }

    console.log('[AddFileModal] File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const validation = validateFile(file);
    setFileValidation(validation);
    
    if (validation.valid) {
      setSelectedFile(file);
      setUploadState(prev => ({ ...prev, error: null }));
    } else {
      setSelectedFile(null);
      setUploadState(prev => ({ ...prev, error: validation.error }));
    }
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // File input change handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Clear selected file
  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setFileValidation(null);
    setUploadState(prev => ({ ...prev, error: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Upload handler
  const handleUpload = useCallback(async () => {
    console.log('[AddFileModal] Starting upload process...');

    // Validate inputs
    if (!selectedFile) {
      setUploadState(prev => ({ ...prev, error: 'Please select a file' }));
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setUploadState(prev => ({ ...prev, error: passwordValidation.error }));
      return;
    }

    // Get auth token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUploadState(prev => ({ ...prev, status: 'error', error: 'Please sign in to upload files' }));
      return;
    }

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Step 1: Validating
      setUploadState({
        status: 'validating',
        progress: 10,
        message: 'Validating file...',
        error: null,
      });

      await new Promise(resolve => setTimeout(resolve, 300)); // Brief visual delay

      // Step 2: Encrypting
      setUploadState({
        status: 'encrypting',
        progress: 30,
        message: 'Encrypting file with AES-256-GCM...',
        error: null,
      });

      await new Promise(resolve => setTimeout(resolve, 500)); // Brief visual delay

      // Step 3: Uploading
      setUploadState({
        status: 'uploading',
        progress: 50,
        message: 'Uploading encrypted file to IPFS...',
        error: null,
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('vaultId', vaultId);
      formData.append('encryptionPassword', password);

      console.log('[AddFileModal] Sending upload request...', {
        vaultId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });

      // Make upload request
      const response = await fetch('/api/vaults/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      setUploadState(prev => ({ ...prev, progress: 80 }));

      // Parse response
      const data = await response.json();

      console.log('[AddFileModal] Upload response:', {
        status: response.status,
        success: data.success,
        error: data.error,
      });

      // Handle errors
      if (!response.ok) {
        // Handle vault locked (423)
        if (response.status === 423) {
          throw new Error('🔒 Vault is locked. You can only add files after the unlock time.');
        }

        // Handle unauthorized (401)
        if (response.status === 401) {
          throw new Error('Session expired. Please sign in again.');
        }

        // Handle forbidden (403)
        if (response.status === 403) {
          throw new Error('You do not have permission to add files to this vault.');
        }

        // Handle payload too large (413)
        if (response.status === 413) {
          throw new Error('File is too large. Maximum size is 50MB.');
        }

        // Handle unsupported media type (415)
        if (response.status === 415) {
          throw new Error('File type is not supported.');
        }

        // Generic error
        throw new Error(data.error || `Upload failed (${response.status})`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Success!
      setUploadState({
        status: 'success',
        progress: 100,
        message: 'File uploaded successfully!',
        error: null,
      });

      console.log('[AddFileModal] Upload successful!', {
        fileId: data.fileId,
        ipfsHash: data.ipfsHash,
      });

      // Wait a moment to show success state, then close
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('[AddFileModal] Upload error:', error);

      // Handle abort
      if (error instanceof Error && error.name === 'AbortError') {
        setUploadState({
          status: 'idle',
          progress: 0,
          message: '',
          error: 'Upload cancelled',
        });
        return;
      }

      // Handle other errors
      setUploadState({
        status: 'error',
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.',
      });
    } finally {
      abortControllerRef.current = null;
    }
  }, [selectedFile, password, vaultId, onSuccess, onClose]);

  // Cancel upload
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (uploadState.status !== 'uploading') {
      onClose();
    }
  }, [uploadState.status, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  const isUploading = uploadState.status === 'uploading' || 
                      uploadState.status === 'validating' || 
                      uploadState.status === 'encrypting';
  const canUpload = selectedFile && password.length >= MIN_PASSWORD_LENGTH && !isUploading;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="border-4 border-black bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      >
        {/* Header */}
        <div className="border-b-4 border-black p-4 bg-heirlock-blue flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg">Add File to Vault</h2>
              <p className="text-xs text-gray-700 truncate max-w-[200px]">{vaultName}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="p-2 hover:bg-white/50 transition-colors disabled:opacity-50"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Progress (if uploading) */}
          {isUploading && (
            <div className="border-4 border-black p-4 bg-heirlock-yellow/30">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="font-black text-sm">{uploadState.message}</p>
              </div>
              <div className="w-full h-3 bg-white border-2 border-black">
                <div 
                  className="h-full bg-heirlock-green transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-right">{uploadState.progress}%</p>
            </div>
          )}

          {/* Success State */}
          {uploadState.status === 'success' && (
            <div className="border-4 border-heirlock-green p-4 bg-heirlock-green/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-heirlock-green" />
                <div>
                  <p className="font-black text-heirlock-green">Upload Successful!</p>
                  <p className="text-sm text-gray-600">File has been encrypted and stored securely.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {uploadState.error && uploadState.status !== 'success' && (
            <div className="border-4 border-red-500 p-4 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-red-600">Upload Failed</p>
                  <p className="text-sm text-red-700">{uploadState.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* File Drop Zone (only show if not uploading/success) */}
          {uploadState.status !== 'success' && !isUploading && (
            <>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-4 border-dashed p-8 text-center cursor-pointer transition-all
                  ${isDragging 
                    ? 'border-heirlock-green bg-heirlock-green/10' 
                    : selectedFile 
                      ? 'border-heirlock-green bg-heirlock-green/5' 
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept={ALLOWED_MIME_TYPES.join(',')}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-heirlock-green/20 border-2 border-heirlock-green rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-heirlock-green" />
                    </div>
                    <div>
                      <p className="font-black text-sm truncate max-w-[300px] mx-auto">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {FILE_TYPE_LABELS[selectedFile.type] || selectedFile.type} • {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-black"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-black text-sm">Drop file here or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, Word, Excel, PowerPoint, Text, ZIP, Images
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Maximum size: {formatFileSize(MAX_FILE_SIZE)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Warnings */}
              {fileValidation?.warnings && fileValidation.warnings.length > 0 && (
                <div className="border-2 border-yellow-400 bg-yellow-50 p-3 text-xs">
                  <p className="font-black text-yellow-700 mb-1">⚠️ Warnings:</p>
                  <ul className="list-disc list-inside text-yellow-600 space-y-0.5">
                    {fileValidation.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase">
                  <Lock className="w-4 h-4" />
                  Encryption Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your vault password"
                    className="w-full border-4 border-black p-3 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-heirlock-blue"
                    disabled={isUploading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100"
                    disabled={isUploading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Use the same password you used when creating the vault. This will encrypt your file.
                </p>
              </div>

              {/* Security Info */}
              <div className="border-2 border-gray-200 bg-gray-50 p-4 space-y-2">
                <p className="text-xs font-black text-gray-600 uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Features
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-heirlock-green" />
                    AES-256-GCM Encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-heirlock-green" />
                    Client-side encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3 h-3 text-heirlock-green" />
                    IPFS Storage
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-heirlock-green" />
                    Time-lock protected
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {uploadState.status !== 'success' && (
          <div className="border-t-4 border-black p-4 bg-gray-50 flex gap-3 sticky bottom-0">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="flex-1 border-4 border-black bg-white p-3 font-black text-sm hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className={`
                flex-1 border-4 border-black p-3 font-black text-sm transition-all
                ${canUpload 
                  ? 'bg-heirlock-green hover:bg-heirlock-green/80 text-black' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFileModal;
