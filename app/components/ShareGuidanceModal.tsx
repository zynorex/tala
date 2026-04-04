'use client';

import { Shield, Share2, Key, Mail, Users, CheckCircle, X } from 'lucide-react';

interface ShareGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const STEPS = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Prep the vault',
    lines: [
      'Confirm files are ready and the vault password is stored somewhere secure',
      'Decide who should receive the content and what access level they need',
    ],
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Generate a share link',
    lines: [
      'Pick the permission level and expiration window',
      'Optionally set a share password for an extra layer of security',
    ],
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: 'Deliver safely',
    lines: [
      'Send the link through a trusted channel',
      'Send the vault password separately so it never travels with the link',
    ],
  },
];

export default function ShareGuidanceModal({ isOpen, onClose, onContinue }: ShareGuidanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="border-4 border-black bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ boxShadow: '12px 12px 0 rgba(0,0,0,1)' }}>
        <div className="border-b-4 border-black p-5 bg-heirlock-blue flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-gray-700">VAULT SHARING GUIDE</p>
              <h2 className="font-black text-2xl leading-tight">How sharing works</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border-4 border-black bg-heirlock-yellow/30 p-4 flex gap-4 items-start">
            <div className="p-3 bg-white border-2 border-black">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-lg">Share with intention</p>
              <p className="text-sm text-gray-700">
                Every vault share is audited. Links can expire, be limited, or revoked instantly. The vault password is never embedded inside the link, so keep it separate.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="border-4 border-black bg-white p-4 flex flex-col gap-3" style={{ boxShadow: '6px 6px 0 rgba(0,0,0,1)' }}>
                <div className="p-2 bg-heirlock-green border-2 border-black w-fit">
                  {step.icon}
                </div>
                <div>
                  <p className="font-black text-lg">{step.title}</p>
                  <ul className="text-sm text-gray-700 space-y-1 mt-2 list-disc list-inside">
                    {step.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="border-4 border-black p-4 bg-gray-50 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <p className="font-black text-sm">Sharing checklist</p>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Use a trusted channel for the share link (email, secure messenger, in person)</li>
              <li>Send the vault password through a different channel</li>
              <li>Let recipients know the vault may be time locked and requires patience</li>
              <li>Monitor the shares list to track views and revoke when finished</li>
            </ul>
          </div>

          <div className="flex gap-3 flex-col md:flex-row">
            <button
              onClick={onClose}
              className="flex-1 border-4 border-black bg-white font-black text-sm py-3 hover:bg-gray-100 transition-all"
            >
              Got it for now
            </button>
            <button
              onClick={onContinue}
              className="flex-1 border-4 border-black bg-heirlock-green font-black text-sm py-3 hover:brightness-95 transition-all"
              style={{ boxShadow: '4px 4px 0 rgba(0,0,0,1)' }}
            >
              Continue to share setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
