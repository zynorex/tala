'use client';

import { useEffect, useState } from 'react';
import {
  Download, Shield, CheckCircle, Loader, Cloud, Key, FileCheck,
  Sparkles, X
} from 'lucide-react';

interface DownloadProcessingModalProps {
  isOpen: boolean;
  fileName: string;
  progress: number;
  isDownloading: boolean;
  onCancel?: () => void;
}

/** Step definitions for the download pipeline */
const STEPS = [
  {
    id: 'verify',
    label: 'Verifying Access',
    description: 'Checking vault permissions and authorization',
    icon: Shield,
    progressRange: [0, 25],
  },
  {
    id: 'fetch',
    label: 'Fetching from IPFS',
    description: 'Retrieving encrypted file from decentralized storage',
    icon: Cloud,
    progressRange: [25, 60],
  },
  {
    id: 'decrypt',
    label: 'Decrypting File',
    description: 'AES-256-GCM decryption in progress',
    icon: Key,
    progressRange: [60, 90],
  },
  {
    id: 'complete',
    label: 'Download Ready',
    description: 'Integrity verified — file is ready',
    icon: FileCheck,
    progressRange: [90, 100],
  },
] as const;

/**
 * Download Processing Modal
 * Shows a professional multi-step progress overlay while files are
 * being fetched, decrypted, and delivered to the user.
 */
export function DownloadProcessingModal({
  isOpen,
  fileName,
  progress,
  isDownloading,
}: DownloadProcessingModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  // Show success briefly before auto-closing
  useEffect(() => {
    if (progress >= 100) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [progress]);

  if (!isOpen || (!isDownloading && !showSuccess)) return null;

  // Calculate active step
  const activeStepIndex = STEPS.findIndex(
    (step) => progress >= step.progressRange[0] && progress < step.progressRange[1]
  );
  const currentStep = activeStepIndex === -1 ? STEPS.length - 1 : activeStepIndex;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className="border-4 border-black bg-white max-w-md w-full shadow-brutal relative overflow-hidden"
        style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      >
        {/* Animated accent bar */}
        <div className="h-2 bg-gray-200 w-full relative overflow-hidden">
          <div
            className="h-full bg-heirlock-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {progress < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {showSuccess ? (
              <div className="w-12 h-12 rounded-full bg-heirlock-green/20 border-3 border-heirlock-green flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-heirlock-green" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-heirlock-blue/20 border-3 border-black flex items-center justify-center">
                <Download className="w-6 h-6 text-black animate-pulse" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-black text-black">
                {showSuccess ? 'Download Complete' : 'Processing Download'}
              </h2>
              <p className="text-xs text-gray-500 font-mono truncate max-w-[250px]">{fileName}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-xs font-black font-mono text-black">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 border-2 border-black overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  showSuccess ? 'bg-heirlock-green' : 'bg-heirlock-blue'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-1 mb-6">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isComplete = progress >= step.progressRange[1];
              const isPending = index > currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
                    isActive
                      ? 'bg-heirlock-blue/10 border-2 border-heirlock-blue/30'
                      : isComplete
                      ? 'bg-heirlock-green/5 border-2 border-transparent'
                      : 'border-2 border-transparent opacity-40'
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      isComplete
                        ? 'bg-heirlock-green border-heirlock-green'
                        : isActive
                        ? 'bg-heirlock-blue/20 border-black'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <Loader className="w-4 h-4 text-black animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black ${
                        isComplete
                          ? 'text-heirlock-green'
                          : isActive
                          ? 'text-black'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {(isActive || isComplete) && (
                      <p className="text-[11px] text-gray-500 truncate">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="border-3 border-heirlock-green bg-heirlock-green/10 p-4 mb-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-heirlock-green flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-black">File delivered securely</p>
                <p className="text-xs text-gray-600">
                  Integrity verified — check your downloads folder.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 border-2 border-gray-200 p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-heirlock-green" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                End-to-end encrypted. Your password never leaves this device. Decryption happens entirely in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
