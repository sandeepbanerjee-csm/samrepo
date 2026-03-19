'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignOutButton } from './sign-out-button';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Building2 },
  { href: '/tasks', label: 'Action Items', icon: ListChecks }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4">
      <div className="mb-8 rounded-lg bg-brand-600 p-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100">CRM</p>
        <h1 className="text-lg font-bold">Success Command Center</h1>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
              pathname === href ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <SignOutButton />
      </div>
    </aside>
  );
}
