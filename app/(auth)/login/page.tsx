import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/forms/login-form';
import { createClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-100 via-white to-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Customer Success CRM</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Sign in to your workspace</h1>
        <p className="mt-2 text-sm text-slate-600">Monitor account health, risks, and revenue in one command center.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
