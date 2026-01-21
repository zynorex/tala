'use client';

import { useAdminShortcut } from '@/app/hooks/useAdminShortcut';

export function AdminShortcutProvider({ children }: { children: React.ReactNode }) {
  useAdminShortcut();
  return <>{children}</>;
}

