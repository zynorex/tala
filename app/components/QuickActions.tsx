'use client';

import Link from 'next/link';
import { Plus, Settings, FileText, HelpCircle, Shield } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Create Vault',
      description: 'Encrypt and secure new files',
      href: '/create-vault',
      color: 'bg-heirlock-green',
    },
    {
      icon: FileText,
      label: 'View Vaults',
      description: 'Manage your encrypted data',
      href: '/dashboard',
      color: 'bg-heirlock-blue',
    },
    {
      icon: Shield,
      label: 'Security',
      description: 'Check security settings',
      href: '/dashboard/security',
      color: 'bg-heirlock-pink',
    },
    {
      icon: HelpCircle,
      label: 'Help',
      description: 'Learn how to use TALA',
      href: '/docs',
      color: 'bg-heirlock-yellow',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className={`border-4 border-black ${action.color} p-6 shadow-brutal hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group`}
          >
            <Icon className="w-6 h-6 text-black mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-black text-black text-lg mb-1">{action.label}</h3>
            <p className="text-sm text-gray-700 font-medium">{action.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
