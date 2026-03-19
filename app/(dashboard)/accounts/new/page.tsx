import Link from 'next/link';
import { AccountForm } from '@/components/forms/account-form';

export default function NewAccountPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-600">Register a strategic customer account and baseline commercial details.</p>
        </div>
        <Link href="/accounts" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Back to Accounts
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AccountForm />
      </div>
    </div>
  );
}
