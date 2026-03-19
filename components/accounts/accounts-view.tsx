'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { useAccountFilters } from '@/lib/stores/account-filters';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tiers = ['all', 'strategic', 'enterprise', 'growth'];

export function AccountsView() {
  const { search, tier, setSearch, setTier } = useAccountFilters();
  const { data, isLoading, isError } = useAccounts(search, tier);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
          <p className="text-sm text-slate-600">Manage portfolio accounts and drill into execution-level details.</p>
        </div>
        <Link href="/accounts/new">
          <Button>Create Account</Button>
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <Input placeholder="Search accounts..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select value={tier} onChange={(event) => setTier(event.target.value)}>
          {tiers.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">ARR</th>
              <th className="px-4 py-3">Renewal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Loading accounts...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-600">
                  Failed to load accounts.
                </td>
              </tr>
            ) : (data ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No accounts found.
                </td>
              </tr>
            ) : (
              (data ?? []).map((account) => (
                <tr key={account.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/accounts/${account.id}`} className="text-brand-700 hover:text-brand-800">
                      {account.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{account.industry ?? 'N/A'}</td>
                  <td className="px-4 py-3">
                    <Badge label={account.account_tier ?? 'unknown'} tone="blue" />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(account.arr)}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {account.renewal_date ? format(new Date(account.renewal_date), 'MMM d, yyyy') : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
