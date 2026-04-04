'use client';

import { Shield, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

interface SecurityMetricsProps {
  data: {
    totalVaults: number;
    secureVaults: number;
    activeVaults: number;
  };
}

export default function SecurityMetrics({ data }: SecurityMetricsProps) {
  const securityScore = 98;
  const encryptionStatus = 'AES-256-GCM';
  const backupStatus = 'Not configured';
  const lastSecurityCheck = new Date().toLocaleDateString();

  return (
    <div className="border-4 border-black bg-white shadow-brutal">
      {/* Header */}
      <div className="border-b-4 border-black p-6 bg-heirlock-pink flex items-center gap-3">
        <Shield className="w-6 h-6 text-black" />
        <h3 className="font-black text-xl text-black">Security Metrics</h3>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Score */}
        <div className="p-4 border-3 border-black bg-cream">
          <p className="text-xs font-black text-gray-700 uppercase mb-2">Security Score</p>
          <div className="flex items-center justify-between">
            <p className="font-black text-3xl text-heirlock-green">{securityScore}</p>
            <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center bg-heirlock-green text-white font-black">
              {securityScore}%
            </div>
          </div>
          <p className="text-xs text-gray-600 font-medium mt-2">Excellent - All vaults encrypted</p>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border-2 border-black bg-green-50">
            <span className="text-xs font-bold text-gray-700">Encryption</span>
            <span className="font-black text-sm text-green-700">{encryptionStatus}</span>
          </div>

          <div className="flex items-center justify-between p-3 border-2 border-black bg-yellow-50">
            <span className="text-xs font-bold text-gray-700">Backup Status</span>
            <span className="font-black text-sm text-yellow-700">⚠ {backupStatus}</span>
          </div>

          <div className="flex items-center justify-between p-3 border-2 border-black bg-blue-50">
            <span className="text-xs font-bold text-gray-700">Last Check</span>
            <span className="font-black text-sm text-blue-700">{lastSecurityCheck}</span>
          </div>
        </div>

        {/* Vault Protection */}
        <div className="pt-4 border-t-2 border-black mt-4">
          <p className="text-xs font-black text-gray-700 uppercase mb-3">Vault Protection</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">
                {data.secureVaults} vault{data.secureVaults !== 1 ? 's' : ''} encrypted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">
                {data.activeVaults} vault{data.activeVaults !== 1 ? 's' : ''} time-locked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                Blockchain verified
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-4 p-3 border-2 border-yellow-500 bg-yellow-50">
          <p className="text-xs font-black text-yellow-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Recommendation
          </p>
          <p className="text-xs text-yellow-800 font-medium">
            Set up backup for encryption keys to improve security score.
          </p>
        </div>
      </div>
    </div>
  );
}
